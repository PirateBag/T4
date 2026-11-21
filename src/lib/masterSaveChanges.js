import {CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {postData} from "../HttpUtils.js";
import {extractMessageFromResponse} from "./extractMessageFromResponse.js";

function isRowMemberOf( {searchFor, rowsToSearch} ) {
    const rValue = rowsToSearch.some( row => row.id === searchFor.id );
    return rValue;
}
export async function masterSaveChanges( { rows, messageSetter, updatedRowsSetter, url } ) {

    const rowsWithInsertIdsSetToZero =
        rows.map( row => row.crudAction === CRUD_ACTION_INSERT ? { ...row, id: 0 } : row );
    const objectToTransmit =  { rows: rowsWithInsertIdsSetToZero.filter( row => row.crudAction !== CRUD_ACTION_NONE ) };

    try {
        const response  = await postData({
            'parameters': objectToTransmit,
            'url': url
        });

        if ( response.status === 200 && response.data.errors.length === 0) {

            const rowsFromResponse = response.data.data;
            // console.log( "Rows from response", rowsFromResponse )

            const screenLessInsertOrDelete =  rows.filter( row => row.crudAction !== CRUD_ACTION_INSERT && row.crudAction !== CRUD_ACTION_DELETE );
            const newInserts = rowsFromResponse.filter( rowOfResponse =>
                !isRowMemberOf( {'searchFor': rowOfResponse, 'rowsToSearch' : rows } ) );
            const newChanges = rowsFromResponse.filter( rowOfResponse =>
                isRowMemberOf( {'searchFor': rowOfResponse, 'rowsToSearch' : rows } ) );

            //  On screen objects may have the crudAction set to INSERT or DELETE,
            newChanges.map( rowOfResponse => rowOfResponse.crudAction = CRUD_ACTION_NONE);

            // console.log( "less Insert and Deletes on screen", screenLessInsertOrDelete );
            // console.log( "Inserts to be added to screen.", newInserts );
            // console.log( "Changes to be added to screen.", newChanges );

            const combinedChanges = screenLessInsertOrDelete.concat( newInserts, newChanges );

            console.log( "Combined changes to be added to screen.", combinedChanges );
            updatedRowsSetter( combinedChanges );
        }

        const errorMessage = extractMessageFromResponse( response );
        messageSetter( errorMessage );
        return response;
    } catch (error) {
        messageSetter("Unusual error updating order: " +  error );
        return error.response || { status: 500 };
    }
}

