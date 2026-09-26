import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {itemMasterReportUrl} from "../Globals.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";

export function ItemMasterButton( parameters, messageSetter ) {

    async function transitionToItemMaster() {
        const objectToBeTransmitted = {updatedRows: parameters};
        const response = await postData({
            parameters: { 'rows': objectToBeTransmitted },
            url: itemMasterReportUrl
        });

        if (response.status === 200) {
            const nextScreen = new ScreenTransition("Item Master Report", GenericText, CRUD_ACTION_NONE, response.data.data);
            ScreenStack.push(nextScreen);
        } else {
            messageSetter("Error retrieving with response " + response.status);
        }
    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToItemMaster}>Item Master Report </Button>
    );
}