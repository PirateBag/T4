import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ScreenStack} from "../Stack.js";
import {
    modernRequestPayloadTemplate, newEmptyQueryConstant, orderLineItemCrudUrl, orderLineItemQueryUrl
} from "../Globals.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {
    OrderLineItemComponentResultsMetaData,
    OrderLineItemResultsEditableMetaData,
    OrderQueryRequestEditableMetadata
} from "./OrderMasterConfig.js";
import {sourceAndOrderTypeMap} from "../enums/orderType.js";
import {ORDER_STATE_OPEN} from "../enums/orderState.js";
import FormQueryPanel, {extractMessageFromResponse} from "../FormQueryPanel.js";
import {placeParametersInTemplate, postData} from "../HttpUtils.js";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";

const OrderMaster = () => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [orderParentQueryResults, setOrderParentQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState({});
    const [orderComponentQueryResults, setOrderComponentQueryResults ] = useState( [] );

    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            const results = response.data.data;
            const resultsWithMetadata = results.map((row) => ({
                ...row,
                delete: false,
                crudAction: CRUD_ACTION_NONE,
            }));

            setOrderParentQueryResults(resultsWithMetadata);
        } else {
            setMessage("Error");
        }
    }

    const queryFormPanelService = new FormQueryPanel(
        {queryPanel: queryParameters,
            setQueryPanel: setQueryParameters,
            validationRules: OrderQueryRequestEditableMetadata,
            requestTemplate: modernRequestPayloadTemplate,
            afterPostCallback: afterQueryPostedCallback } );


    function mapItemQueryToOliQueryParameters( rowOfItem ) {
        if ( rowOfItem.id === undefined ) {
            return newEmptyQueryConstant
        }

        let oliQueryParameters = { 'itemId' : rowOfItem.id };
        oliQueryParameters.orderType = sourceAndOrderTypeMap[ rowOfItem.sourcing ];
        oliQueryParameters.orderState = ORDER_STATE_OPEN;

        return oliQueryParameters;
    }

    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (orderParentQueryResults.length === 0) {
                if ( ScreenStack.stackTop().data !== undefined) {
                    const queryParametersForOpeningScreen = mapItemQueryToOliQueryParameters( ScreenStack.stackTop().data );
                    setQueryParameters( queryParametersForOpeningScreen );
                    const objectToBeTransmitted = placeParametersInTemplate( { requestTemplate : modernRequestPayloadTemplate,
                        singleRowOfQueryParameters: queryParametersForOpeningScreen });
                    const allQueryResultsButShouldOnlyBeOne =  await Promise.all(  [postData( {'parameters' : objectToBeTransmitted, 'url' : orderLineItemQueryUrl}) ] );

                    const results = allQueryResultsButShouldOnlyBeOne[0].data?.data || [];
                    results.forEach(row => row.crudAction = CRUD_ACTION_NONE);
                    setOrderParentQueryResults( results )
                }
            }
        };
        fetchData();
    }, []); // Dependency array ensures this runs only on mount

    //
    // async function ItemQueryRowChange(newValue, oldValue) {
    //     if (isShallowEqual(newValue, oldValue)) {
    //         console.log("Row " + oldValue.id + " unchanged, skipping update");
    //         return;
    //     }
    //     newValue.crudAction = newValue.crudAction === CRUD_ACTION_INSERT ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
    //     const updatedRow = {...newValue};
    //
    //     const objectToBeTransmitted = queryFormService.singleRowToRequest(updatedRow);
    //     updateFormService.postData(objectToBeTransmitted, itemUpdateUrl);
    //     // Clear focus from the cell after successful update
    //     setTimeout(() => {
    //         apiRef.current.setCellFocus(0, '');
    //     }, 0);
    //     return updatedRow
    // }
    //
    function clearQueryParameters(event) {
        setOrderParentQueryResults([])
        setQueryParameters({})
        queryFormPanelService.clearFormValues(event);
    }

    async function saveParentChanges( ) {
        const ordersToBeChanged = orderParentQueryResults.filter( row => row.crudAction !== CRUD_ACTION_NONE );
        const objectToBeTransmitted = { 'rows' : ordersToBeChanged };
        try {
            const response  = await postData({
                'parameters': objectToBeTransmitted,
                'url': orderLineItemCrudUrl
            });

            const errorMessage = extractMessageFromResponse( response );
            if ( errorMessage.length > 0 ) {
                setMessage( errorMessage );
            }
        } catch (error) {
            const errorMessage = extractMessageFromResponse( error );
            setMessage("Unusual error updating order: " +  errorMessage );
        }
        const priorOrderQueryResults = orderComponentQueryResults;
        priorOrderQueryResults.forEach( row => row.crudAction = CRUD_ACTION_NONE );
        setOrderComponentQueryResults( priorOrderQueryResults )
    }


    function handleProcessRowUpdate( newRow, oldRow ) {
        if ( newRow === undefined || oldRow === undefined ) {
            console.log("Invalid row data provided for handleProcessRowUpdate");
            return oldRow;
        }

        if (newRow.crudAction === oldRow.crudAction || newRow.crudAction === undefined) {
            if (newRow.crudAction !== CRUD_ACTION_DELETE && newRow.crudAction !== CRUD_ACTION_INSERT) {
                newRow.crudAction = CRUD_ACTION_CHANGE;
            }
        }

        setOrderParentQueryResults(prev => prev.map(row => row.id === newRow.id ? newRow : row));
        console.log("Row state updated for ID: " + newRow.id + " " + newRow.orderState );
        return newRow;
    }

    const handleParentRowSelectionChange = async ( row ) => {
            const selected = row[0];
            if (selected === undefined) {
                setOrderComponentQueryResults([]);
                return;
            }
            console.log("Parent " + selected.id + " selected in ordermaster.handleParentRowSelected");
            const componentQueryParameters = { rows: [ {'parentOliId': selected.id } ] };
            const allQueryResultsFromPromiseButShouldOnlyBeOne = await Promise.all([postData( {'parameters' : componentQueryParameters,
                'url' : orderLineItemQueryUrl })] );
            const results = allQueryResultsFromPromiseButShouldOnlyBeOne[0].data?.data || [];
            results.forEach(row => row.crudAction = CRUD_ACTION_NONE);
            setOrderComponentQueryResults( results )
        }

    const handleComponentSelectionChange = ( row ) => {
        const selected = row[0];
        if (selected === undefined) {
            setOrderComponentQueryResults([]);
            return;
        }
        console.log("Component " + selected.id + " selected");

    }

    function handleComponentRowUpdate( newRow, oldRow ) {
        if ( newRow === undefined || oldRow === undefined ) {
            console.log("Invalid row data provided for handleComponentRowUpdate");
            return oldRow;
        }

        if (newRow.crudAction === oldRow.crudAction || newRow.crudAction === undefined) {
            if (newRow.crudAction !== CRUD_ACTION_DELETE && newRow.crudAction !== CRUD_ACTION_INSERT) {
                newRow.crudAction = CRUD_ACTION_CHANGE;
            }
        }

        setOrderComponentQueryResults(prev => prev.map(row => row.id === newRow.id ? newRow : row));
        console.log("Component row state updated for ID: " + newRow.id + " " + newRow.orderState );
        return newRow;
    }


    async function saveComponentChanges( ) {
        const objectToBeTransmitted = { rows: orderComponentQueryResults.filter( row => row.crudAction !== CRUD_ACTION_NONE ) };

        try {
            const response  = await postData({
                'parameters': objectToBeTransmitted,
                'url': orderLineItemCrudUrl
            });

            const errorMessage = extractMessageFromResponse( response );
            if ( errorMessage.length > 0 ) {
                setMessage( errorMessage );
            }
        } catch (error) {
            const errorMessage = extractMessageFromResponse( error );
            setMessage("Unusual error updating order: " +  errorMessage );
        }
    }

    const saveChildThenParentResults =  async () => {
        if (orderComponentQueryResults.some(row => row.crudAction !== CRUD_ACTION_NONE)) {
            await saveComponentChanges();
        }

        if (orderParentQueryResults.some(row => row.crudAction !== CRUD_ACTION_NONE)) {
            await saveParentChanges();
        }
    }


    return (
        <div>
            <form onSubmit={queryFormPanelService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <PropertyGrid label={"Order Query Parameters"}
                              objectToPresent={queryParameters}
                              handleInputChangeCallback={queryFormPanelService.handleInputChange}
                              validationRules={OrderQueryRequestEditableMetadata}
                />
                <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>
                <Grid size={{xs: 12}} container spacing={4}>
                    <Button type="submit" variant="contained" name={orderLineItemQueryUrl} >Search</Button>
                    <Button onClick={clearQueryParameters}>Clear</Button>
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </form>


            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Box sx={{height: 400, width: '100%', mb: 10}}>


                <DataGridHelper label="Order Query Results"
                                rows={orderParentQueryResults}
                                columns={OrderLineItemResultsEditableMetaData}
                                onSelectionChange={handleParentRowSelectionChange}
                                handleRowChangeCallback={handleProcessRowUpdate}


                />

                <Grid container sx={{mt: 1}}>
                        <Grid container sx={{mt: 2}} size={{xs: 12}}>
                            <Button variant="outlined" sx={{ mr: 1 }} onClick={saveParentChanges}>Save Changes</Button>
                        </Grid>
                </Grid>


            </Box>
            {  /*orderComponentQueryResults.length > 0 && (*/
                <>
                    <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

                    <Box sx={{height: 400, width: '100%', mb: 10}}>

                        <DataGridHelper label="Inputs to order:"
                                        rows={orderComponentQueryResults}
                                        columns={OrderLineItemComponentResultsMetaData}
                                        onSelectionChange={handleComponentSelectionChange}
                                        handleRowChangeCallback={handleComponentRowUpdate}
                        />
                        <Grid container sx={{mt: 1}}>
                            <Grid container sx={{mt: 2}} size={{xs: 12}}>
                                <Button variant="outlined" sx={{ mr: 1 }} onClick={saveChildThenParentResults}>Save Component Changes</Button>
                            </Grid>
                        </Grid>

                    </Box>
                </>
            }

        </div>
    );
};

export default OrderMaster;
