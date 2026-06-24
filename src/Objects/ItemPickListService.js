import * as HttpUtils from "../HttpUtils.js";
import {itemPickAll} from "../Globals.js";

export async function loadItemPickListAll({responseSetter, errorMessageSetter}) {
    const currentFunctionName = 'loadItemPickListALl ';
    const response = await HttpUtils.postData({
        parameters: {'idToSearchFor': 0},
        url: 'http://localhost:8080/' + itemPickAll
    });
    console.log(currentFunctionName + "received:", response.status);
    if (response.status === 200) {
        console.log(currentFunctionName + "retrieved " + response.data.data.length + " rows");
        responseSetter(response.data.data);
    } else {
        console.log(currentFunctionName + "error  " + response.status);
        errorMessageSetter(currentFunctionName + " request returned " + response.status);
    }
    return response.data.data;
}