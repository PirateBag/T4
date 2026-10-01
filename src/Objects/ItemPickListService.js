import {itemPickAllUrl, orderLineItemQueryUrl} from "../Globals.js";
import {postData} from "../HttpUtils.js";

export async function loadItemPickListAll({responseSetter, errorMessageSetter} = {}) {

    const objectToBeTransmitted = {'idToSearchFor': 0};
    const allQueryResultsButShouldOnlyBeOne =
        await Promise.all(  [postData( {'parameters' : objectToBeTransmitted, 'url' : itemPickAllUrl}) ] );
    const response = allQueryResultsButShouldOnlyBeOne[0].data?.data || [];

    console.log(itemPickAllUrl + " received:", response?.status);
    if (response && response.status === 200) {
        console.log(itemPickAllUrl + "retrieved " + (response.data?.data?.length ?? 0) + " rows");
        if (typeof responseSetter === 'function') {
            responseSetter(response.data?.data);
        }
        return response.data?.data;
    } else {
        const status = response?.status;
        console.log(itemPickAllUrl + "error " + status);
        if (typeof errorMessageSetter === 'function') {
            errorMessageSetter(itemPickAllUrl + "request returned " + status);
        }
    }
    return response?.data?.data;
}

export { loadItemPickListAll as loadItemPickList };