import {Button} from "@mui/material";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import Adjustment from "../Forms/Adjustment.jsx";
import {SPF_ORDER_LINE} from "../enums/screenParameterFormats.js";
import {CaseConversion as screenTransitionParameterFormat} from "../Metadata/ValidationRuleConstants.js";


export function OrderAdjustmentButton( selectedOrderRow, messageSetter ) {
    async function transitionToOrdersForItem() {
        if ( selectedOrderRow === undefined ) {
            messageSetter("No order selected");
            return;
        }
        const foreignKey = selectedOrderRow.parameters;

        const nextScreen = new ScreenTransition("Adjustments for Order " + selectedOrderRow.id,
            Adjustment, CRUD_ACTION_NONE, [foreignKey], SPF_ORDER_LINE );
        ScreenStack.push(nextScreen);
    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToOrdersForItem}>Adjustments</Button>
    );
}