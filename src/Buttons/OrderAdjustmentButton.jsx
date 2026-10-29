import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {adjustmentQueryUrl, itemMasterReportUrl, orderLineItemQueryUrl} from "../Globals.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import OrderMaster from "../Forms/OrderMaster.jsx";
import Adjustment from "../Forms/Adjustment.jsx";
import FitTextButton from "./FitTextButton.jsx";
import * as adjustmentType from "../enums/adjustmentType.js";


export function OrderAdjustmentButton( selectedOrderRow, messageSetter ) {
    async function transitionToOrdersForItem() {
        const adjustmentQueryParameter = {
            "orderId" : selectedOrderRow.id,
            "orderType" : "MOHEAD",
            "adjustmentType" : adjustmentType.XFER,
            "crudAction" : CRUD_ACTION_NONE
        }


        let nextScreen = new ScreenTransition("Max Level Report", GenericText, CRUD_ACTION_NONE, rowsWithIds);
        ScreenStack.push(nextScreen);

    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToOrdersForItem}>Adjustments</Button>
    );
}