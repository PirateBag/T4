import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {itemMaxLevelReportUrl, olderEmptyQueryConstant} from "../Globals.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";

export function MaxLevelButton( messageSetter ) {
    async function buttonHandler() {
        try {
            const response = await postData({parameters: olderEmptyQueryConstant, url: itemMaxLevelReportUrl});

            if (response && response.data && response.data.data) {
                const data = response.data.data;
                const rowsWithIds = data.map((row, index) => ({
                    ...row,
                    id: row.id || (index + 1)
                }));

                let nextScreen = new ScreenTransition("Max Level Report", GenericText, CRUD_ACTION_NONE, rowsWithIds);
                ScreenStack.push(nextScreen);
            } else {
                messageSetter("Failed to fetch Max Level report data.");
            }
        } catch (error) {
            console.error("Error fetching Max Level report:", error);
            messageSetter("Error loading Max Level report.");
        }
    }
    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={buttonHandler}>Calculate Max Level</Button>
    );
}