import * as HttpUtils from "../HttpUtils.js";
import {itemPickAllUrl} from "../Globals.js";

export async function loadItemPickListAll({responseSetter, errorMessageSetter} = {}) {
    const [response] = await Promise.all([
        HttpUtils.postData({
            parameters: {'idToSearchFor': 0},
            url: 'http://localhost:8080/' + itemPickAllUrl
        })
    ]);
    console.log(itemPickAllUrl + "received:", response?.status);
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