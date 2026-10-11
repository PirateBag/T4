import {itemPickAllUrl} from "../Globals.js";
import {postData} from "../HttpUtils.js";

export async function loadItemPickListAll({responseSetter, errorMessageSetter} = {}) {

    const objectToBeTransmitted = {'idToSearchFor': 0};
    const allQueryResultsButShouldOnlyBeOne =
        await Promise.all(  [postData( {'parameters' : objectToBeTransmitted, 'url' : itemPickAllUrl}) ] );
    const response = allQueryResultsButShouldOnlyBeOne[0].data?.data;
    const errorResponse = allQueryResultsButShouldOnlyBeOne;
    if ( Array.isArray( response ) ){
        console.log(itemPickAllUrl + "retrieved " + response.length + " rows");

        if (typeof responseSetter === 'function') {
            responseSetter( response );
        }
        return 'Provide response Setter';
    } else {
        const errorResponse = allQueryResultsButShouldOnlyBeOne;

        const status = errorResponse?.status;
        console.log(itemPickAllUrl + " request failed " + errorResponse);
        if (typeof errorMessageSetter === 'function') {
            errorMessageSetter(itemPickAllUrl + " request failed  " + status);
        }
    }
    return errorResponse
}

export { loadItemPickListAll as loadItemPickList };