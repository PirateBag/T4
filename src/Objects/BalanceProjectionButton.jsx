import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {balanceProjectionUrl, genericSingleRequest} from "../Globals.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";

export function BalanceProjectionButton(  ) {

    async function transitionToBalanceProjection() {
        const balanceLogs =  await Promise.all(
            [postData( {'parameters' : {...genericSingleRequest }
                , 'url' : balanceProjectionUrl}) ] );
        const dataAfterResponseFluff = balanceLogs[0].data?.data || [];
        let nextScreen = new ScreenTransition("balance projection", GenericText, CRUD_ACTION_NONE, dataAfterResponseFluff);
        ScreenStack.push(nextScreen);
    }



    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToBalanceProjection}>Balance Projection Report</Button>
    );
}