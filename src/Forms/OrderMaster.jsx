import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ScreenStack} from "../Stack.js";
import {
    modernRequestPayloadTemplate, newEmptyQueryConstant, orderLineItemCrudUrl, orderLineItemQueryUrl
} from "../Globals.js";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {
    OrderLineItemComponentResultsMetaData,
    OrderLineItemResultsEditableMetaData,
    OrderQueryRequestEditableMetadata
} from "./OrderMasterConfig.js";
import {sourceAndOrderTypeMap} from "../enums/orderType.js";
import {ORDER_STATE_OPEN} from "../enums/orderState.js";
import {placeParametersInTemplate, postData} from "../HttpUtils.js";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {loadItemPickListAll} from "../Objects/ItemPickListService.js";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import {noop} from "../lib/noop.js";
import {extractMessageFromResponse} from "../FormQueryPanel.js";
import {formatDate} from "../lib/dates.js";
import ErrorMessage from "../ErrorMessage.jsx";
import {ClearOrdersButton} from "../Objects/ClearOrdersButton.jsx";


const OrderMaster = () => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [orderParentQueryResults, setOrderParentQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState(    [{lineNo: 1}]);
    const [orderComponentQueryResults, setOrderComponentQueryResults ] = useState( [] );
    const [selectedParentOrder, setSelectedParentOrder] = useState(null);
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
            try {
                if (orderParentQueryResults.length === 0) {
                    if ( ScreenStack.stackTop().data !== undefined) {
                        const queryParametersForOpeningScreen = mapItemQueryToOliQueryParameters( ScreenStack.stackTop().data );
                        setQueryParameters( [ { lineNo: 1, ...queryParametersForOpeningScreen } ] );
                        const objectToBeTransmitted = placeParametersInTemplate( { requestTemplate : modernRequestPayloadTemplate,
                            singleRowOfQueryParameters: queryParametersForOpeningScreen });
                        const allQueryResultsButShouldOnlyBeOne =  await Promise.all(  [postData( {'parameters' : objectToBeTransmitted, 'url' : orderLineItemQueryUrl}) ] );

                        const results = allQueryResultsButShouldOnlyBeOne[0].data?.data || [];
                        results.forEach(row => row.crudAction = CRUD_ACTION_NONE);
                        setOrderParentQueryResults( results )
                    }
                }
            } catch (error) {
                console.error("Error fetching data in useEffect:", error);
                setMessage("Error loading initial data");
            }
        };
        fetchData().catch(error => setMessage("Promise rejection in fetchData:" + error));
        loadItemPickListAll({
            responseSetter: (data) => setItemPickList(data.map(item => ({ value: item.id, label: item.external }))),
            errorMessageSetter: setMessage
        });

    }, []); // Dependency array ensures this runs only on mount


    const addOrder = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const firstQueryParam = Array.isArray(queryParameters) ? queryParameters[0] : queryParameters;
        const newOrder = {
            id: Math.floor(Math.random() * 1000000) + 1000001,
            delete: false,
            itemId: firstQueryParam?.itemId,
            quantityOrdered: 0,
            quantityAssigned: 0,
            startDate: formatDate(today),
            completeDate: formatDate(tomorrow),
            parentOliId: 0,
            orderState: ORDER_STATE_OPEN,
            orderType: firstQueryParam?.orderType,
            crudAction: CRUD_ACTION_INSERT
        };

        setOrderParentQueryResults(prev => [newOrder, ...prev]);
    };

    const deleteOrder = async () => {
        if (!selectedParentOrder) return;

        const updatedOrders = orderParentQueryResults.map(row =>
            row.id === selectedParentOrder.id ? { ...row, crudAction: CRUD_ACTION_DELETE } : row
        );
        console.log( "Identified order for deletion:", selectedParentOrder);
        const response = await masterSaveChanges(updatedOrders, setMessage, setOrderParentQueryResults);
        if (response && response.status === 200) {
            setSelectedParentOrder(null);
            setOrderComponentQueryResults([]);
        }
    };

    const addComponent = () => {
        if (!selectedParentOrder) return;

        let completeDate = "";
        if (selectedParentOrder.startDate) {
            try {
                const [year, monthDay] = selectedParentOrder.startDate.split('-');
                const month = monthDay.substring(0, 2);
                const day = monthDay.substring(2, 4);
                const parentStartDate = new Date(`${year}-${month}-${day}`);
                if (!isNaN(parentStartDate.getTime())) {
                    const componentCompleteDate = new Date(parentStartDate);
                    componentCompleteDate.setDate(parentStartDate.getDate() - 1);
                    completeDate = formatDate(componentCompleteDate);
                }
            } catch (e) {
                console.error("Error parsing parent start date", e);
            }
        }

        const newComponent = {
            id: Math.floor(Math.random() * 1000000) + 1000001,
            delete: false,
            itemId: "",
            quantityOrdered: 0,
            quantityAssigned: 0,
            startDate: "",
            completeDate: completeDate,
            parentOliId: selectedParentOrder.id,
            orderState: selectedParentOrder.orderState,
            orderType: "MODET",
            crudAction: CRUD_ACTION_INSERT
        };

        setOrderComponentQueryResults(prev => [newComponent, ...prev]);
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

    const refreshComponentList = async (parentOrder) => {
        if (!parentOrder) {
            setOrderComponentQueryResults([]);
            return;
        }
        console.log("Refreshing components for Parent " + parentOrder.id);
        const componentQueryParameters = { rows: [ {'parentOliId': parentOrder.id } ] };
        const allQueryResultsFromPromiseButShouldOnlyBeOne = await Promise.all([postData( {'parameters' : componentQueryParameters,
            'url' : orderLineItemQueryUrl })] );
        const results = allQueryResultsFromPromiseButShouldOnlyBeOne[0].data?.data || [];
        results.forEach(row => row.crudAction = CRUD_ACTION_NONE);
        setOrderComponentQueryResults( results )
    }

    const handleParentRowSelectionChange = async ( row ) => {
            const selected = row[0];
            setSelectedParentOrder(selected || null);
            await refreshComponentList(selected);
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
            const objectToBeTransmitted = Array.isArray(queryParameters)
                ? { 'rows': queryParameters }
                : placeParametersInTemplate({
                    requestTemplate: modernRequestPayloadTemplate,
                    singleRowOfQueryParameters: queryParameters
                });
            const response = await postData({'parameters': objectToBeTransmitted, 'url': orderLineItemQueryUrl});
            afterQueryPostedCallback(response);
            if (selectedParentOrder) {
                await refreshComponentList(selectedParentOrder);
            } else {
                setOrderComponentQueryResults([]);
            }
        }
    }

    return (
        <div>
            <ErrorMessage message={message}/><br/>

            <SearchParametersForm
                searchUrl={orderLineItemQueryUrl}
                setMessage={setMessage}
                queryParameters={queryParameters}
                setQueryParameters={setQueryParameters}
                columns={OrderQueryRequestEditableMetadata}
                label="Order Query Parameters"
                rowsOfQueryResults={orderParentQueryResults}
                setRowsOfQueryResults={setOrderParentQueryResults}
                pickListsForSelect = {{ 'itemId' : itemPickList}}
                handleAdd={noop}
                handleDelete={noop}
                handleClear={noop}
            />

            <ClearOrdersButton/>

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Box sx={{minHeight: 400, width: '100%', mb: 10}}>

                <DataGridHelper label="Order Query Results"
                                rows={orderParentQueryResults}
                                columns={OrderLineItemResultsEditableMetaData}
                                onSelectionChange={handleParentRowSelectionChange}
                                handleRowChangeCallback={handleProcessRowUpdate}
                                pickListsForSelect={{ itemId: itemPickList }}
                                autoHeight={true}
                />

                <Grid container sx={{mt: 1}}>
                    <Grid container sx={{mt: 2}} size={{xs: 12}}>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={addOrder}>Add New</Button>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={saveChildThenParentResults}>Save Changes</Button>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={deleteOrder} disabled={!selectedParentOrder}>Delete</Button>
                    </Grid>
                </Grid>

            </Box>
            {
                <>
                    <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>


                    <Box sx={{minHeight: 400, width: '100%', mb: 10}}>
                        <DataGridHelper label="Inputs to order:"
                                        rows={orderComponentQueryResults}
                                        columns={OrderLineItemComponentResultsMetaData}
                                        onSelectionChange={handleComponentSelectionChange}
                                        handleRowChangeCallback={handleComponentRowUpdate}
                                        pickListsForSelect={{ itemId: itemPickList }}
                                        autoHeight={true}
                        />
                    </Box>
                    <Grid container sx={{ mb: 2, ml: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={addComponent}
                            disabled={!selectedParentOrder}
                        >
                            Add Component
                        </Button>
                    </Grid>

                </>
            }
        </div>
    );
};

export default OrderMaster;
