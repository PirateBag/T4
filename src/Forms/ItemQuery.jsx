import React, {useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryRequestEditableMetadata, ItemQueryResultsMetadata} from "./ItemQueryConfig.js";
import {useGridApiRef} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import {
    itemQueryUrl
    } from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";
import {ItemDtoToStringWithOperation} from "./ItemPropertiesConfig.js";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import Adjustment from "./Adjustment.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import {enableButton} from "../lib/noop.js";
import {ItemMasterButton} from "../Objects/ItemMasterButton.jsx";
import {MaxLevelButton} from "../Objects/MaxLevelButton.jsx";
import {PlanningButton} from "../Objects/PlanningButton.jsx";


const ItemQuery = () => {

    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);

    const apiRef = useGridApiRef();

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);

    // async function ItemQueryRowChange(newValue, oldValue) {
    //     if (isShallowEqual(newValue, oldValue)) {
    //         console.log("Row " + oldValue.id + " unchanged, skipping update");
    //         return;
    //     }
    //     newValue.crudAction = newValue.crudAction === CRUD_ACTION_INSERT ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
    //     const updatedRow = {...newValue};
    //
    //     const objectToBeTransmitted = {rows: [updatedRow]};
    //     await postData({"parameters": objectToBeTransmitted, "url": itemUpdateUrl})
    //     // Clear focus from the cell after successful update
    //     setTimeout(() => {
    //         apiRef.current.setCellFocus(0, '');
    //     }, 0);
    //     return updatedRow
    // }

    function transitionToAdjustment() {
        let nextScreen = new ScreenTransition("Adjustment Report", Adjustment, CRUD_ACTION_NONE, []);
        ScreenStack.push(nextScreen);
    }

    function transitionToItemPropertiesAdd() {
        const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        ScreenStack.push(nextScreen);
    }

    const handleRowSelectionChange = (row) => {
        const selectedRow = row[0];
        const transitionLabel = "Change Item Properties" + ItemDtoToStringWithOperation(selectedRow);

        const nextScreen = new ScreenTransition(transitionLabel,
            ItemProperties, CRUD_ACTION_CHANGE, [selectedRow]);

        ScreenStack.push(nextScreen);
    }

    return (
        <div>
            <ErrorMessage message={message}/>
            <br/>

            <SearchParametersForm
                searchUrl={itemQueryUrl}
                rowsOfQueryResults={rowsOfQueryResults}
                setRowsOfQueryResults={setRowsOfQueryResults}
                setMessage={setMessage}

                queryParameters={queryParameters}
                setQueryParameters={setQueryParameters}

                columns={ItemQueryRequestEditableMetadata}
                label="Item Query Parameters"

                handleClear={enableButton}
                handleReturn={enableButton}
            />

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Grid size={{xs: 12}} container spacing={2}>
                <Grid size="auto">
                    <ItemMasterButton parameters={queryParameters} messageSetter={setMessage}/>
                </Grid>
                <Grid size="auto">
                    <MaxLevelButton messageSetter={setMessage}/>
                </Grid>
                <Grid size="auto">
                    <PlanningButton/>
                </Grid>
                <Grid size="auto">
                    <Button variant="outlined" onClick={transitionToAdjustment}>Adjustment</Button>
                </Grid>
            </Grid>


            <Box sx={{height: 400, width: '100%', mb: 10}}>
                <DataGridHelper apiRef={apiRef}
                                label="Item Query Results"
                                rows={rowsOfQueryResults}
                                columns={ItemQueryResultsMetadata}
                                onSelectionChange={handleRowSelectionChange}
                />

                <Grid container sx={{mt: 1}}>
                    <Grid size="auto">
                        <Button variant="outlined" onClick={transitionToItemPropertiesAdd}>Add</Button>
                    </Grid>
                </Grid>

            </Box>
        </div>
    );
};

export default ItemQuery;
