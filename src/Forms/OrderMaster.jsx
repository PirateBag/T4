import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse, isShallowEqual} from "../FormService.js";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import {
    modernRequestPayloadTemplate, newEmptyQueryConstant, orderLineItemQueryUrl
} from "../Globals.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";
import {OrderLineItemResultsEditableMetaData, OrderQueryRequestEditableMetadata} from "./OrderMasterConfig.js";
import {sourceAndOrderTypeMap} from "../enums/orderType.js";
import {ORDER_STATE_OPEN} from "../enums/orderState.js";



const OrderMaster = () => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState({});

    const handleInputChange = (rule) => {
        return (event) => {
            let value = event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            setQueryParameters({...queryParameters, [rule.field]: value});
        }
    }

    //
    // const afterItemMasterQueryResults = (response) => {
    //     console.log("afterItemMasterQueryResults received:", response.status);
    //     if (response.status === 200) {
    //         setMessage("Success, retrieved " + response.data.data.length + " rows");
    //         setItemMasterQueryResults(response.data.data);
    //     } else {
    //         setMessage("Error");
    //         setRowsOfQueryResults([]);
    //     }
    // }
    //
    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            setRowsOfQueryResults(response.data.data);
        } else {
            setMessage("Error");
        }
    }
    //  const afterChangeCallback = (responseFromUpdate) => {
    //     if (responseFromUpdate.status !== 200) {
    //         setMessage("Error" + responseFromUpdate.message);
    //         return;
    //     }
    //     const messageFromResponse = extractMessageFromResponse(responseFromUpdate);
    //     setMessage(messageFromResponse);
    //
    //     if (messageFromResponse.length > 0) {
    //         return;
    //     }
    //     const updatedRow = responseFromUpdate.data.data[0];
    //     updatedRow.crudAction = CRUD_ACTION_NONE;
    //     const newRowsOfData = rowsOfQueryResults.map((row) =>
    //         row.id === updatedRow.id ? updatedRow : row);
    //
    //     setRowsOfQueryResults(newRowsOfData);
    //     console.log("Response " + JSON.stringify(rowsOfQueryResults));
    // }
    //
    //
    const queryFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterQueryPostedCallback,
            requestTemplate: modernRequestPayloadTemplate
        }
    );
    //
    //
    // const updateFormService = new FormService({
    //         messageFormSetter: setMessage,
    //         messagesFromForm: message,
    //         afterPostCallback: afterChangeCallback,
    //         requestTemplate: itemCrudRequestTemplate
    //     }
    // );
    //
    // const itemMasterFormService = new FormService({
    //         messageFormSetter: setMessage,
    //         messagesFromForm: message,
    //         afterPostCallback: afterItemMasterQueryResults,
    //         requestTemplate: itemMasterReportUrl
    //     }
    // );
    //
    //


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
                    queryParametersForOpeningScreen = {};
                    objectToBeTransmitted = newEmptyQueryConstant;
                } else {
                    queryParametersForOpeningScreen = mapItemQueryToOliQueryParameters( ScreenStack.stackTop().data );
                    objectToBeTransmitted = queryFormService.singleRowToRequest(queryParametersForOpeningScreen);
                }
                setQueryParameters( queryParametersForOpeningScreen );
                await queryFormService.postData(objectToBeTransmitted, orderLineItemQueryUrl);
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
        queryFormService.clearFormValues(event);
    }

    // function transitionToItemMaster(event) {
    //     //  The queryFormService owns the form we want to extract from.
    //     const objectToBeTransmitted = queryFormService.extractRequestAsObject(event)
    //     itemMasterFormService.postData(objectToBeTransmitted, itemMasterReportUrl);
    //
    //     let nextScreen = new ScreenTransition("Item Master Report", ItemMaster, CRUD_ACTION_NONE, itemMasterQueryResults);
    //     ScreenStack.push(nextScreen);
    // }
    //
  function transitionToOliPropertiesAdd() {
        // const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        // ScreenStack.push(nextScreen);
    }


    const handleRowSelectionChange = ( row ) => {
            const selectedRow = row[0];
            // const transitionLabel = "Change Item Properties" + ItemDtoToStringWithOperation(selectedRow);
            //
            // const nextScreen = new ScreenTransition( transitionLabel,
            //     ItemProperties, CRUD_ACTION_CHANGE, [selectedRow]);

            // ScreenStack.push(nextScreen);
        }

    return (
        <div>
            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <PropertyGrid label={"Order Query Parameters"}
                              objectToPresent={queryParameters}
                              validationRules={OrderQueryRequestEditableMetadata}
                              handleInputChangeCallback={handleInputChange}/>
                <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>
                <Grid size={{xs: 12}} container spacing={2}>
                            <Button type="submit" variant="contained" name={'dontpushme'} >Search</Button>
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
        </div>
    );
};

export default OrderMaster;
