import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryRequestEditableMetadata, ItemQueryResultsMetadata} from "./ItemQueryConfig.js";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import {itemCrudUrl, itemQueryUrl} from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";
import {ItemDtoToStringWithOperation} from "./ItemPropertiesConfig.js";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import Adjustment from "./Adjustment.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import {enableButton} from "../lib/noop.js";
import {ItemMasterButton} from "../Buttons/ItemMasterButton.jsx";
import {MaxLevelButton} from "../Buttons/MaxLevelButton.jsx";
import {PlanningButton} from "../Buttons/PlanningButton.jsx";
import OrderMaster from "./OrderMaster.jsx";
import {SPF_ITEM} from "../enums/screenParameterFormats.js";
import {randomId} from "../lib/randomId.js";

const ItemQuery = () => {
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);

    function transitionToAdjustment() {
        let nextScreen = new ScreenTransition("Adjustment Report", Adjustment, CRUD_ACTION_NONE,
            selectedRow ? [selectedRow] : [] );
        ScreenStack.push(nextScreen);
    }

    const [selectedRow, setSelectedRow] = useState(null);

    // Keep the selected row current when results are edited, or clear it if it was removed
    useEffect(() => {
        setSelectedRow(previous => previous
            ? rowsOfQueryResults.find(row => row.id === previous.id) ?? null
            : null);
    }, [rowsOfQueryResults]);

    const handleRowSelectionChange = (rows) => {
        setSelectedRow(rows?.[0] ?? null);
        setMessage( null );
    }

    const transitionToItemPropertiesChange = () => {
        if (!selectedRow) return;
        const transitionLabel = "Change Item Properties" + ItemDtoToStringWithOperation(selectedRow);

        const nextScreen = new ScreenTransition(transitionLabel,
            ItemProperties, CRUD_ACTION_CHANGE, [selectedRow]);

        ScreenStack.push(nextScreen);
    }

    const transitionToOrders = () => {
        if (!selectedRow) return;
        const transitionLabel = "Item Orders" + ItemDtoToStringWithOperation(selectedRow);

        const nextScreen = new ScreenTransition(transitionLabel,
            OrderMaster, CRUD_ACTION_CHANGE, [selectedRow], SPF_ITEM);

        ScreenStack.push(nextScreen);
    }

    const addItemToQueryResults = () => {
        const newItem = {
            id: randomId(),
            unitCost : 0.0,
            sourcing: 'MAN',
            leadTime: 0,
            quantityOnHand: 0.0,
            minimumOrderQuantity: 0,
            crudAction: CRUD_ACTION_INSERT
        };

        setRowsOfQueryResults( prev => [newItem, ...prev ] );
    };

    const deleteRowFromQueryResults = () => {
        if (!selectedRow || selectedRow.id <= 100000) return;
        setRowsOfQueryResults(prev => prev.filter(row => row.id !== selectedRow.id));
        setSelectedRow(null);
    };


    // //  const saveChanges  =  async () => {
    //     setMessage("");
    //     await masterSaveChanges(
    //         { 'rows' : queryParameters,
    //         'messageSetter': setMessage,
    //         'updateRowsSetter' : setRowsOfQueryResults,
    //         'url' : itemCrudUrl } );
    // }


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
            </Grid>


            <Box sx={{height: 400, width: '100%', mb: 10}}>
                <DataGridHelper
                                label="Item Query Results"
                                rows={rowsOfQueryResults}
                                setRows={setRowsOfQueryResults}
                                setMessage={setMessage}
                                columns={ItemQueryResultsMetadata}
                                onSelectionChange={handleRowSelectionChange}
                                getRowClassName={(params) => params.row === selectedRow ? 'selected-row' : ''}
                                sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                                submitButton={{'label': 'Save', 'url': itemCrudUrl}}
                                extraButtons={
                                    <>
                                    <Button variant="outlined" onClick={transitionToItemPropertiesChange} disabled={!selectedRow}>Properties</Button>
                                    <Button variant="outlined" onClick={transitionToOrders} disabled={!selectedRow}>Orders</Button>
                                    <Button variant="outlined" onClick={transitionToAdjustment} disabled={!selectedRow}>Adjustment</Button>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={addItemToQueryResults}>New Item</Button>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={deleteRowFromQueryResults} disabled={!selectedRow || selectedRow.id <= 100000}>Cancel Insert</Button>
                                    </>
                                }
                />

            </Box>
        </div>
    );
};

export default ItemQuery;
