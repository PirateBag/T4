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
import {loadItemPickListAll} from "../Objects/ItemPickListService.js";


const OrderMaster = () => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [orderParentQueryResults, setOrderParentQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState({});
    const [orderComponentQueryResults, setOrderComponentQueryResults ] = useState( [] );
    const [itemPickList, setItemPickList] = useState([]);

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
        loadItemPickListAll({
            responseSetter: (data) => setItemPickList(data.map(item => ({ value: item.id, label: item.external }))),
            errorMessageSetter: setMessage
        });

    }, []); // Dependency array ensures this runs only on mount


    function clearQueryParameters(event) {
        setOrderParentQueryResults([])
        setQueryParameters({})
        queryFormPanelService.clearFormValues(event);
    }

    const addOrder = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const formatDate = (date) => {
            const [year, month, day] = date.toISOString().split('T')[0].split('-');
            return `${year}-${month}${day}`;
        };

        const newOrder = {
            id: Math.floor(Math.random() * 1000000) + 1000001,
            delete: false,
            itemId: queryParameters.itemId,
            quantityOrdered: 0,
            quantityAssigned: 0,
            startDate: formatDate(today),
            completeDate: formatDate(tomorrow),
            parentOliId: 0,
            orderState: ORDER_STATE_OPEN,
            orderType: queryParameters.orderType,
            crudAction: CRUD_ACTION_INSERT
        };

        setOrderParentQueryResults(prev => [newOrder, ...prev]);
    };

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
        console.log("Row state updated for ID: " + newRow.id + " " + newRow.delete + ' ' + newRow.crudAction );
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



    async function masterSaveChanges( objectToBeTransmitted, messageSetter, updatedRowsSetter ) {
        const objectsWithActiveCrudAction = { rows: objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_NONE ) };

        try {
            const response  = await postData({
                'parameters': objectsWithActiveCrudAction,
                'url': orderLineItemCrudUrl
            });

            if ( response.status === 200 ) {
                const afterRemovingDeletedRows = objectToBeTransmitted.filter( row => row.crudAction !== CRUD_ACTION_DELETE );
                afterRemovingDeletedRows.forEach( row => row.crudAction = CRUD_ACTION_NONE );
                updatedRowsSetter( afterRemovingDeletedRows );
            }
            const errorMessage = extractMessageFromResponse( response );
            messageSetter( errorMessage );
            return response;
        } catch (error) {
            const errorMessage = extractMessageFromResponse( error );
            messageSetter("Unusual error updating order: " +  errorMessage );
            return error.response || { status: 500 };
        }

    }

    const saveChildThenParentResults =  async () => {
        setMessage("");
        let success = true;

        if ( orderComponentQueryResults instanceof Array  && orderComponentQueryResults.some(row => row.crudAction !== CRUD_ACTION_NONE)) {
            const response = await masterSaveChanges( orderComponentQueryResults, setMessage, setOrderComponentQueryResults  );
            if (!response || response.status !== 200) {
                success = false;
            }
        }

        if (success && orderParentQueryResults.some(row => row.crudAction !== CRUD_ACTION_NONE)) {
            const response = await masterSaveChanges( orderParentQueryResults, setMessage, setOrderParentQueryResults );
            if (!response || response.status !== 200) {
                success = false;
            }
        }

        if (success) {
            const objectToBeTransmitted = placeParametersInTemplate({
                requestTemplate: modernRequestPayloadTemplate,
                singleRowOfQueryParameters: queryParameters
            });
            const response = await postData({'parameters': objectToBeTransmitted, 'url': orderLineItemQueryUrl});
            afterQueryPostedCallback(response);
            setOrderComponentQueryResults([]);
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
                              pickListsForSelect={{ itemId: itemPickList }}
                />
                <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>
                <Grid size={{xs: 12}} container spacing={4}>
                    <Button type="submit" variant="contained" name={orderLineItemQueryUrl} >Search</Button>
                    <Button onClick={clearQueryParameters}>Clear</Button>
                    <Button variant="outlined" onClick={addOrder}>Add Order</Button>
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </form>


            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Box sx={{height: 400, width: '100%', mb: 10}}>
                <Grid container sx={{mt: 1}}>
                    <Grid container sx={{mt: 2}} size={{xs: 12}}>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={saveChildThenParentResults}>Save Changes</Button>
                    </Grid>
                </Grid>

                <DataGridHelper label="Order Query Results"
                                rows={orderParentQueryResults}
                                columns={OrderLineItemResultsEditableMetaData}
                                onSelectionChange={handleParentRowSelectionChange}
                                handleRowChangeCallback={handleProcessRowUpdate}
                                pickListsForSelect={{ itemId: itemPickList }}
                />
           </Box>
            {
                <>
                    <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

                    <Box sx={{height: 400, width: '100%', mb: 10}}>

                        <DataGridHelper label="Inputs to order:"
                                        rows={orderComponentQueryResults}
                                        columns={OrderLineItemComponentResultsMetaData}
                                        onSelectionChange={handleComponentSelectionChange}
                                        handleRowChangeCallback={handleComponentRowUpdate}
                                        pickListsForSelect={{ itemId: itemPickList }}
                        />
                    </Box>
                </>
            }
        </div>
    );
};

export default OrderMaster;
