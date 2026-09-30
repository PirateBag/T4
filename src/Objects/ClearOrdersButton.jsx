import {ScreenStack} from "../Stack.js";
import {postData} from "../HttpUtils.js";
import {clearOrdersUrl, genericSingleRequest} from "../Globals.js";
import {Button} from "@mui/material";

export function ClearOrdersButton(  ) {

    async function transitionToClearOrders() {
        await Promise.all([postData({
            'parameters': {...genericSingleRequest, idToSearchFor: '2'}
            , 'url': clearOrdersUrl
        })]);
        ScreenStack.pop();

    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToClearOrders}>Clear Orders</Button>
    );
}

