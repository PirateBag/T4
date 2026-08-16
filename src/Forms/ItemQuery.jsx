import React, {useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {isShallowEqual} from "../FormService.js";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryRequestEditableMetadata, ItemQueryResultsMetadata} from "./ItemQueryConfig.js";
import {useGridApiRef} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import {
    genericSingleRequest,
    itemMasterReportUrl,
    itemQueryUrl,
    itemUpdateUrl,
    maxLevelUrl,
    planAllUrl
} from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";
import {ItemDtoToStringWithOperation} from "./ItemPropertiesConfig.js";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {postData} from "../HttpUtils.js";
import GenericText from "./GenericText.jsx";
import Adjustment from "./Adjustment.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";


const ItemQuery = () => {

    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);

    const apiRef = useGridApiRef();

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);

    /*    const afterItemMasterQueryResults = (response) => {
            console.log("afterItemMasterQueryResults received:", response.status);
            if (response.status === 200) {
                setMessage("Success, retrieved " + response.data.data.length + " rows");
                setRowsOfQueryResults(response.data.data);
            } else {
                setMessage("Error");
                setRowsOfQueryResults([]);
            }
        }
    */

    /*
        // Fetch data on mount if empty
        useEffect(() => {
            const fetchData = async () => {
                if (rowsOfQueryResults.length === 0) {
                    // Trigger search with empty values
                    queryFormService.postData(olderEmptyQueryConstant, itemQueryUrl);
                }
            };
            fetchData();
        }, []); // Dependency array ensures this runs only on mount

    */
    async function ItemQueryRowChange(newValue, oldValue) {
        if (isShallowEqual(newValue, oldValue)) {
            console.log("Row " + oldValue.id + " unchanged, skipping update");
            return;
        }
        newValue.crudAction = newValue.crudAction === CRUD_ACTION_INSERT ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
        const updatedRow = {...newValue};

        //  const objectToBeTransmitted = queryFormService.singleRowToRequest(updatedRow);
        const objectToBeTransmitted = {rows: [updatedRow]};
        await postData({"parameters": objectToBeTransmitted, "url": itemUpdateUrl})
        // Clear focus from the cell after successful update
        setTimeout(() => {
            apiRef.current.setCellFocus(0, '');
        }, 0);
        return updatedRow
    }

    async function transitionToItemMaster() {
        const objectToBeTransmitted = {updatedRows: queryParameters};
            const response = await postData({
                parameters: { 'rows': objectToBeTransmitted },
                url: itemMasterReportUrl
            });

            if (response.status === 200) {
                const nextScreen = new ScreenTransition("Item Master Report", GenericText, CRUD_ACTION_NONE, response.data.data);
                ScreenStack.push(nextScreen);
            } else {
                setMessage("Error retrieving with response " + response.status);
                setRowsOfQueryResults([]);
            }
    }

    async function transitionToMaxDepth() {
        const maxLevelLogs = await Promise.all([postData({
            'parameters': genericSingleRequest
            , 'url': maxLevelUrl
        })]);
        const dataAfterResponseFluff = maxLevelLogs[0].data?.data || [];
        let nextScreen = new ScreenTransition("Max Level Logs", GenericText, CRUD_ACTION_NONE, dataAfterResponseFluff);
        ScreenStack.push(nextScreen);
    }

    async function transitionToPlanning() {
        const planningLogs = await Promise.all([postData({
            'parameters': {...genericSingleRequest, idToSearchFor: '-1'}
            , 'url': planAllUrl
        })]);
        const dataAfterResponseFluff = planningLogs[0].data?.data || [];
        let nextScreen = new ScreenTransition("Inventory Planning", GenericText, CRUD_ACTION_NONE, dataAfterResponseFluff);
        ScreenStack.push(nextScreen);
    }

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

            />

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Grid size={{xs: 12}} container spacing={2}>
                <Grid size="auto">
                    <Button variant="outlined" onClick={transitionToItemMaster}>Item Master Report</Button>
                </Grid>
                <Grid size="auto">
                    <Button variant="outlined" onClick={transitionToMaxDepth}>Refresh Max Depth</Button>
                </Grid>
                <Grid size="auto">
                    <Button variant="outlined" onClick={transitionToPlanning}>Planning</Button>
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
