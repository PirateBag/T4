import {itemPickAllUrl} from "../Globals.js";
import {postData} from "../HttpUtils.js";

export async function loadItemPickListAll({responseSetter, errorMessageSetter} = {}) {

    const objectToBeTransmitted = {'idToSearchFor': 0};
    const allQueryResultsButShouldOnlyBeOne =
        await Promise.all([postData({'parameters': objectToBeTransmitted, 'url': itemPickAllUrl})]);
    const response = allQueryResultsButShouldOnlyBeOne[0].data?.data;
    const errorResponse = allQueryResultsButShouldOnlyBeOne;
    if (Array.isArray(response)) {
        console.log(itemPickAllUrl + "retrieved " + response.length + " rows");

        if (typeof responseSetter === 'function') {
            responseSetter(response);
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

export function descriptionFromId({pickList, id}) {
    const description = pickList.find(itemPick => itemPick.value === id)?.label;
    return description || "No Item";
}

export async function itemPickListLoader({responseSetter, errorMessageSetter}) {
    const objectToBeTransmitted = {'idToSearchFor': 0};
    const allQueryResultsButShouldOnlyBeOne =
        await Promise.all([postData({'parameters': objectToBeTransmitted, 'url': itemPickAllUrl})]);
    const response = allQueryResultsButShouldOnlyBeOne[0].data?.data;
    const errorResponse = allQueryResultsButShouldOnlyBeOne;

    if (Array.isArray(response)) {
        console.log(itemPickAllUrl + "retrieved " + response.length + " rows");

        if (typeof responseSetter === 'function') {
            const mappedData = mapItemsToPicklist(response);
            responseSetter(mappedData);
        } else {
            throw new Error('Provide responseSetter as function') ;
        }
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

export function mapItemsToPicklist(items) {
    if (items.length === 0) throw new Error("No items");
    const pickList = items.map(item => ({'value': item.id, 'label': item.external, ...item}));
    if (pickList.length !== items.length) throw new Error("items.length != pciklist.length");
    return pickList;
};

export {loadItemPickListAll as loadItemPickList};