import {extractMessageFromResponse} from "../FormQueryPanel.js";
import {CRUD_ACTION_DELETE, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {postData} from "../HttpUtils.js";


export async function saveCrudObjects(
    { objectToBeTransmitted, messageSetter, updatedRowsSetter, updateUrl } ) {
              const objectsWithActiveCrudAction = { rows: objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_NONE ) };
              try {
                  const response  = await postData({
                      'parameters': objectsWithActiveCrudAction,
                      'url': updateUrl
                  });

                  if ( response.status === 200 ) {
                      const afterRemovingDeletedRows = objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_DELETE );
                      afterRemovingDeletedRows.forEach( row => row.crudAction = CRUD_ACTION_NONE );
                      updatedRowsSetter( afterRemovingDeletedRows );
                  }
                  const errorMessage = extractMessageFromResponse( response );
                  messageSetter( errorMessage );
                  return response;
              } catch (error) {
                  const errorMessage = extractMessageFromResponse( error );
                  messageSetter("Unusual error updating order: " +  errorMessage );
                  return error.response || { status: 500 };
              }
          }
