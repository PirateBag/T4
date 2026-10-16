import React, {useEffect, useState} from 'react';
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

    function transitionToAdjustment() {
        let nextScreen = new ScreenTransition("Adjustment Report", Adjustment, CRUD_ACTION_NONE, []);
        ScreenStack.push(nextScreen);
    }

    function transitionToItemPropertiesAdd() {
        const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        ScreenStack.push(nextScreen);
    }

    const [selectedRow, setSelectedRow] = useState(null);

    // Clear the selection whenever a new query replaces the results
    useEffect(() => {
        setSelectedRow(null);
    }, [rowsOfQueryResults]);

    const handleRowSelectionChange = (rows) => {
        setSelectedRow(rows?.[0] ?? null);
    }

    const transitionToItemPropertiesChange = () => {
        if (!selectedRow) return;
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

                handleAdd={enableButton}
                handleDelete={enableButton}
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
                                getRowClassName={(params) => params.row === selectedRow ? 'selected-row' : ''}
                                sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                />

                <Grid container spacing={1} sx={{mt: 1}}>
                    <Grid size="auto">
                        <Button variant="outlined" onClick={transitionToItemPropertiesAdd}>Add</Button>
                    </Grid>
                    <Grid size="auto">
                        <Button variant="outlined" onClick={transitionToItemPropertiesChange} disabled={!selectedRow}>
                            Show Item Properties
                        </Button>
                    </Grid>
                </Grid>

            </Box>
        </div>
    );
};

export default ItemQuery;
