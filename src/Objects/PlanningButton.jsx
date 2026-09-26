import {Button} from "@mui/material";
import {postData} from "../HttpUtils.js";
import {ScreenStack} from "../Stack.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import GenericText from "../Forms/GenericText.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import {genericSingleRequest, planAllUrl} from "../Globals.js";

export function PlanningButton(  ) {

    async function transitionToPlanning() {
        const planningLogs = await Promise.all([postData({
            'parameters': {...genericSingleRequest, idToSearchFor: '-1'}
            , 'url': planAllUrl
        })]);
        const dataAfterResponseFluff = planningLogs[0].data?.data || [];
        let nextScreen = new ScreenTransition("Inventory Planning", GenericText, CRUD_ACTION_NONE, dataAfterResponseFluff);
        ScreenStack.push(nextScreen);
    }

    return (
        <Button variant="outlined" sx={{mr: 1}} onClick={transitionToPlanning}>Inventory Planning</Button>
    );
}