import {CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {postData} from "../HttpUtils.js";
import {extractMessageFromResponse} from "./extractMessageFromResponse.js";

function isRowMemberOf( {searchFor, rowsToSearch} ) {
    const rValue = rowsToSearch.some( row => row.id === searchFor.id );
    return rValue;
}
export async function masterSaveChanges( objectToBeTransmitted, messageSetter, updatedRowsSetter, url ) {

    const objectsWithActiveCrudAction = { rows: objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_NONE ) };

    objectsWithActiveCrudAction.rows.forEach( row => row.id = row.crudAction === CRUD_ACTION_INSERT ? 0 : row.id );

    try {
        const response  = await postData({
            'parameters': objectsWithActiveCrudAction,
            'url': url
        });

        if ( response.status === 200 && response.data.errors.length === 0) {
            //     const afterRemovingDeletedRows = objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_DELETE );
            //     afterRemovingDeletedRows.forEach( row => row.crudAction = CRUD_ACTION_NONE );
            //     updatedRowsSetter( afterRemovingDeletedRows );

            /*
                remove all items on the screen that are CRUD_ACTION_INSERT or DELETE
                for each item in the response.
                    find the corresponding item on the screen.
                        if the item does not exist on the screen, insert it into the screen.  (handles inserted, carries new id).
                        if the item exists in both and crudAction===CRUD_ACTION_CHANGE, replace the item with the response.  (Handles change )
             */

            const rowsFromResponse = response.data.data;
            // console.log( "Rows from response", rowsFromResponse )

            const screenLessInsertOrDelete =  objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_INSERT && row.crudAction !== CRUD_ACTION_DELETE );
            const newInserts = rowsFromResponse.filter( rowOfResponse =>
                !isRowMemberOf( {'searchFor': rowOfResponse, 'rowsToSearch' : objectToBeTransmitted } ) );
            const newChanges = rowsFromResponse.filter( rowOfResponse =>
                isRowMemberOf( {'searchFor': rowOfResponse, 'rowsToSearch' : objectToBeTransmitted } ) );

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

