import {CRUD_ACTION_DELETE, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {postData} from "../HttpUtils.js";
import {extractMessageFromResponse} from "./extractMessageFromResponse.js";


export async function saveCrudObjects(
    {objectToBeTransmitted, messageSetter, updatedRowsSetter, updateUrl}) {

    console.log("saveCrudObjects: " + updateUrl + ": " + (objectToBeTransmitted.length ?? "No objects"));
    const objectsWithActiveCrudAction = {rows: objectToBeTransmitted.filter(row => row.crudAction !== CRUD_ACTION_NONE)};

    if (objectsWithActiveCrudAction.rows.length === 0) return;
    try {
        const response = await postData({
            'parameters': objectsWithActiveCrudAction,
            'url': updateUrl
        });

        if (response.status === 200) {
            const afterRemovingDeletedRows = objectToBeTransmitted.filter(row => row.crudAction !== CRUD_ACTION_DELETE);
            afterRemovingDeletedRows.forEach(row => row.crudAction = CRUD_ACTION_NONE);
            updatedRowsSetter(afterRemovingDeletedRows);
        }
        const errorMessage = extractMessageFromResponse(response);
        messageSetter(errorMessage);
        return response;
    } catch (error) {
        const errorMessage = extractMessageFromResponse(error);
        messageSetter("Unusual error updating order: " + errorMessage);
        return error.response || {status: 500};
    }
}
