import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse, isShallowEqual} from "../FormService.js";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryRequestEditableMetadata, ItemQueryResultsMetadata} from "./ItemQueryConfig.js";
import {useGridApiRef} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemMaster from "./ItemMaster.jsx";
import {ScreenStack} from "../Stack.js";
import {itemCrudRequestTemplate, itemMasterReportUrl, itemQueryAll, itemQueryUrl, itemUpdateUrl} from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";
import {ItemDtoToStringWithOperation} from "./ItemPropertiesConfig.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";


const ItemQuery = () => {

    const apiRef = useGridApiRef();
    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [itemMasterQueryResults, setItemMasterQueryResults] = useState([]);
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


    const afterItemMasterQueryResults = (response) => {
        console.log("afterItemMasterQueryResults received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            setItemMasterQueryResults(response.data.data);
        } else {
            setMessage("Error");
            setRowsOfQueryResults([]);
        }
    }

    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success, retrieved " + response.data.data.length + " rows");
            setRowsOfQueryResults(response.data.data);
        } else {
            setMessage("Error");
            setRowsOfQueryResults([]);
        }
    }
    const afterChangeCallback = (responseFromUpdate) => {
        if (responseFromUpdate.status !== 200) {
            setMessage("Error" + responseFromUpdate.message);
            return;
        }
        const messageFromResponse = extractMessageFromResponse(responseFromUpdate);
        setMessage(messageFromResponse);

        if (messageFromResponse.length > 0) {
            return;
        }
        const updatedRow = responseFromUpdate.data.data[0];
        updatedRow.crudAction = CRUD_ACTION_NONE;
        const newRowsOfData = rowsOfQueryResults.map((row) =>
            row.id === updatedRow.id ? updatedRow : row);

        setRowsOfQueryResults(newRowsOfData);
        console.log("Response " + JSON.stringify(rowsOfQueryResults));
    }


    const queryFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterQueryPostedCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );


    const updateFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterChangeCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );

    const itemMasterFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterItemMasterQueryResults,
            requestTemplate: itemMasterReportUrl
        }
    );


    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                // Trigger search with empty values
                queryFormService.postData(itemQueryAll, itemQueryUrl);
            }
        };
        fetchData();
    }, []); // Dependency array ensures this runs only on mount


    async function ItemQueryRowChange(newValue, oldValue) {
        if (isShallowEqual(newValue, oldValue)) {
            console.log("Row " + oldValue.id + " unchanged, skipping update");
            return;
        }
        newValue.crudAction = newValue.crudAction === CRUD_ACTION_INSERT ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
        const updatedRow = {...newValue};

        const objectToBeTransmitted = queryFormService.singleRowToRequest(updatedRow);
        updateFormService.postData(objectToBeTransmitted, itemUpdateUrl);
        // Clear focus from the cell after successful update
        setTimeout(() => {
            apiRef.current.setCellFocus(0, '');
        }, 0);
        return updatedRow
    }

    function clearQueryParameters(event) {
        setRowsOfQueryResults([])
        setQueryParameters({})
        queryFormService.clearFormValues(event);
    }

    function transitionToItemMaster(event) {
        //  The queryFormService owns the form we want to extract from.
        const objectToBeTransmitted = queryFormService.extractRequestAsObject(event)
        itemMasterFormService.postData(objectToBeTransmitted, itemMasterReportUrl);

        let nextScreen = new ScreenTransition("Item Master Report", ItemMaster, CRUD_ACTION_NONE, itemMasterQueryResults);
        ScreenStack.push(nextScreen);
    }

    function transitionToItemPropertiesAdd() {
        const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        ScreenStack.push(nextScreen);
    }


    const handleRowSelectionChange = ( row ) => {
            const selectedRow = row[0];
            const transitionLabel = "Change Item Properties" + ItemDtoToStringWithOperation(selectedRow);

            const nextScreen = new ScreenTransition( transitionLabel,
                ItemProperties, CRUD_ACTION_CHANGE, [selectedRow]);

            ScreenStack.push(nextScreen);
        }

    return (
        <div>
            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <PropertyGrid label={"Item Query Parameters"}
                              objectToPresent={queryParameters}
                              validationRules={ItemQueryRequestEditableMetadata}
                              handleInputChangeCallback={handleInputChange}/>


                                    <Grid size={{xs: 12}} container spacing={2}>
                        <Grid size="auto">
                            <Button type="submit" variant="contained" name={itemQueryUrl} >Search</Button>
                        </Grid>
                        <Grid size="auto">
                            <Button onClick={clearQueryParameters}>Clear</Button>
                        </Grid>
                        <Grid size="auto">
                            <Button variant="outlined" onClick={transitionToItemMaster}>Item Master Report</Button>
                        </Grid>
                    </Grid>
            </form>

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

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
