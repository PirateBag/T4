import {ScreenStack} from "../Stack.js";
import {postData} from "../HttpUtils.js";
import {clearOrdersUrl, clearItemBalances, genericSingleRequest } from "../Globals.js";
import {FitTextButton} from "./FitTextButton.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import GenericText from "../Forms/GenericText.jsx";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";

export function ClearOrdersButton(  ) {

    async function transitionToClearOrders( ) {

        const responses = await Promise.all(
            [postData({ 'parameters': {...genericSingleRequest, idToSearchFor: '2'}, 'url': clearOrdersUrl }),
                postData({ 'parameters': {...genericSingleRequest, idToSearchFor: '0'}, 'url': clearItemBalances })
            ]);

        const dataToPresent = [
            ...(responses[0].data?.data || []),
            ...(responses[1].data?.data || [])
        ];

        if (dataToPresent.length > 0) {
            const rowsWithIds = dataToPresent.map((row, index) => ({
                ...row,
                id: row.id || (index + 1)
            }));

            let nextScreen = new ScreenTransition("Clear Data Logs", GenericText, CRUD_ACTION_NONE, rowsWithIds);
            ScreenStack.push(nextScreen);
        }
    }

    return (
        <FitTextButton variant="outlined" sx={{mr: 1}} onClick={transitionToClearOrders}>Clear Orders</FitTextButton>
    );
}

