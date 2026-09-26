import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {itemExplosionReportUrl } from "../Globals.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";

export function ItemExplosionButton( parentItemId, messageSetter ) {

    async function buttonHandler( ) {
        const effectiveParentId = parentItemId.id ?? "1";
        const parametersForExplosionRequest = { "parentId" : effectiveParentId  };
        const response = await postData({ parameters: parametersForExplosionRequest, url: itemExplosionReportUrl });

        if (response && response.data && response.data.data) {
            const data = response.data.data;
            const rowsWithIds = data.map((row, index) => ({
                ...row,
                id: row.id || (index + 1)
            }));
            let nextScreen = new ScreenTransition("ItemExplosion Master Report", GenericText, CRUD_ACTION_NONE, rowsWithIds);
            ScreenStack.push(nextScreen);
        } else {
            messageSetter("Failed to fetch explosion report data.");
        }
    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={buttonHandler}>Item Explosion Report</Button>
    );
}