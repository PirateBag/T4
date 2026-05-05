import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import { modernRequestPayloadTemplate, newEmptyQueryConstant, orderLineItemQueryUrl
} from "../Globals.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";
import {OrderLineItemResultsEditableMetaData, OrderQueryRequestEditableMetadata} from "./OrderMasterConfig.js";
import {sourceAndOrderTypeMap} from "../enums/orderType.js";
import {ORDER_STATE_OPEN} from "../enums/orderState.js";
import FormQueryPanel from "../FormQueryPanel.js";



const OrderMaster = () => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState({});
    const [orderDetailsQueryResults, setOrderDetailsQueryResults ] = useState( [] );


    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            setRowsOfQueryResults(response.data.data);
        } else {
            setMessage("Error");
        }
    }

    const afterDetailsPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            setOrderDetailsQueryResults(response.data.data);
        } else {
            setMessage("Error");
        }
    }


    const orderDetailFormService = new FormQueryPanel( {
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterDetailsPostedCallback,
            requestTemplate: modernRequestPayloadTemplate
        }
    );

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
            if (rowsOfQueryResults.length === 0) {
                let queryParametersForOpeningScreen;
                let objectToBeTransmitted;
                if ( ScreenStack.stackTop().data === undefined) {
                    // objectToBeTransmitted = newEmptyQueryConstant;
                } else {
                    queryParametersForOpeningScreen = mapItemQueryToOliQueryParameters( ScreenStack.stackTop().data );
                    setQueryParameters( queryParametersForOpeningScreen );
                    objectToBeTransmitted = queryFormPanelService.placeParametersInTemplate(queryParametersForOpeningScreen);
                    const queryResults =  await queryFormPanelService.postData(objectToBeTransmitted, orderLineItemQueryUrl);
                    setRowsOfQueryResults( queryResults.data.data )

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
        setRowsOfQueryResults([])
        setQueryParameters({})
        queryFormPanelService.clearFormValues(event);
    }

  function transitionToOliPropertiesAdd() {
        // const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        // ScreenStack.push(nextScreen);
    }


    const handleRowSelectionChange = async ( row ) => {
            const selected = row[0];
            if (selected === undefined) {
                setOrderDetailsQueryResults([]);
                return;
            }
            console.log("Row " + selected.id + " selected");
            const componentQueryParameters = { rows: [ {'parentOliId': selected.id } ] };
            await orderDetailFormService.postData(componentQueryParameters, orderLineItemQueryUrl);
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
                                rows={rowsOfQueryResults}
                                columns={OrderLineItemResultsEditableMetaData}
                                onSelectionChange={handleRowSelectionChange}
                />

                <Grid container sx={{mt: 1}}>
                    <Grid size="auto">
                        <Button variant="outlined" onClick={transitionToOliPropertiesAdd}>Add</Button>
                    </Grid>
                </Grid>


            </Box>
            {orderDetailsQueryResults.length > 0 && (
                <>
                    <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

                    <Box sx={{height: 400, width: '100%', mb: 10}}>

                        <DataGridHelper label="Inputs to order:"
                                        rows={orderDetailsQueryResults}
                                        columns={OrderLineItemResultsEditableMetaData}
                                        onSelectionChange={handleRowSelectionChange}
                        />
                    </Box>
                </>
            )}

        </div>
    );
};

export default OrderMaster;
