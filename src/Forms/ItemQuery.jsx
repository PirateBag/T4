import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {extractMessageFromResponse, FormService, isShallowEqual} from "../FormService.jsx";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryParametersDTO,queryResultsConfig} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemMaster from "./ItemMaster.jsx";
import {ScreenStack} from "../Stack.js";
import {
    itemMasterReportUrl,
    itemQueryAll,
    itemQueryUrl,
    itemQueryUrlRequestTemplate,
    itemUpdateUrl
} from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";


const ItemQuery = (  ) => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState( [] );
    const [itemMasterQueryResults, setItemMasterQueryResults] = useState( [] );


    const afterItemMasterQueryResults = ( response ) => {
        console.log( "afterItemMasterQueryResults received:", response.status );
        if ( response.status === 200 ) {
            setMessage( "Success, retrieved " + response.data.data.length + " rows" );
            setItemMasterQueryResults( response.data.data  );
        } else {
            setMessage( "Error" );
            setRowsOfQueryResults( []  );
        }
    }

    const afterQueryPostedCallback = ( response ) => {
        console.log( "afterQueryCallback received:", response.status );
        if ( response.status === 200 ) {
            setMessage( "Success, retrieved " + response.data.data.length + " rows" );
            setRowsOfQueryResults( response.data.data  );
        } else {
            setMessage( "Error" );
            setRowsOfQueryResults( []  );
        }
    }

    const afterChangeCallback = ( responseFromUpdate ) => {
        if ( responseFromUpdate.status !== 200 ) {
            setMessage( "Error" + responseFromUpdate.message );
            return;
        }
        const messageFromResponse = extractMessageFromResponse( responseFromUpdate );
        setMessage( messageFromResponse );

        if ( messageFromResponse.length > 0 ) {
            return;
        }
        const updatedRow = responseFromUpdate.data.data[0];
        updatedRow.crudAction = CRUD_ACTION_NONE;
        const newRowsOfData = rowsOfQueryResults.map((row) =>
                row.id === updatedRow.id ? updatedRow : row  );

        setRowsOfQueryResults( newRowsOfData  );
        console.log( "Response " + JSON.stringify( rowsOfQueryResults ));
    }


    const queryFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterQueryPostedCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    const updateFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterChangeCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    const itemMasterFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterItemMasterQueryResults,
        requestTemplate : itemMasterReportUrl }
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


    async function ItemQueryRowChange(newValue , oldValue ) {
        if (isShallowEqual(newValue, oldValue)) {
            console.log( "Row " + oldValue.id + " unchanged, skipping update" );
            return;
        }
        newValue.crudAction = newValue.crudAction === "CRUD_ACTION_INSERT" ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
        const updatedRow = {...newValue};

        const objectToBeTransmitted = queryFormService.singleRowToRequest(updatedRow);
        updateFormService.postData(objectToBeTransmitted, itemUpdateUrl);
        return updatedRow
    }

    function clearQueryParameters( event ) {
        setRowsOfQueryResults(  [] )
        queryFormService.clearFormValues(event );
    }

    function addRowToGrid( event ) {
        const newRow = { id: parseInt( event.timeStamp *100 ).toString(), crudAction: 'CRUD_ACTION_INSERT', description: "description",
            sourcing: "PUR", quantityOnHand: "0", minimumOrderQuantity: 0.0, unitCost: "0.00", leadTime: 1 };

        setRowsOfQueryResults( rowsOfQueryResults.concat( newRow ));
    }

    function transitionToItemMaster( event ) {
        //  The queryFormService owns the form we want to extract from.
        const objectToBeTransmitted = queryFormService.extractRequestAsObject( event )
        itemMasterFormService.postData(objectToBeTransmitted, itemMasterReportUrl );

        let nextScreen = new ScreenTransition(ItemMaster, 'ItemMaster', itemMasterQueryResults );
        ScreenStack.push(nextScreen);
    }

    const handleCellClick = (params ) => {
        // Check if the clicked cell belongs to the first column (field: 'id')
        if (params.field === ItemQueryParametersDTO[0].field) {
            ScreenStack.push(new ScreenTransition(ItemProperties, 'ItemProperties',
                [ rowsOfQueryResults[ params.value -1  ] ] ) );
        }
    };


    return (
        <div>
            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} padding={2}>
                    {ItemQueryParametersDTO.map((col) => (
                        <Grid size={{xs: 12, sm: 6}} key={col.field}>
                            <TextField
                                type={col.type}
                                size="small"
                                margin="dense"
                                name={col.domainName}
                                placeholder={col.placeholder}
                                maxLength={col.maxLength}
                                defaultValue={''}
                                sx={{ width: '240px' }}
                            />
                        </Grid>
                    ))}
                    <Grid container spacing={2} padding={2}>
                        <Button type="submit" variant="contained" name={itemQueryUrl}>Search</Button>
                        <Button onClick={clearQueryParameters}>Clear</Button>
                        <Button varient="outlined" onClick={transitionToItemMaster} >Item Master Report</Button>
                    </Grid>
                </Grid>
            </form>

            <hr style={{ margin: "20px 0", borderTop: "1px solid #ccc" }} />

            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
                { rowsOfQueryResults.length === 0 ? (
                    "No results"
                ) : (
                    <DataGrid columns={queryResultsConfig}
                              rows={ rowsOfQueryResults }
                              density="compact"
                              processRowUpdate={ItemQueryRowChange}
                              onCellClick={handleCellClick}
                              onProcessRowUpdateError={(error) => console.error("Row update failed:", error)}/>
                ) }
                <Grid size={{xs:12}}>
                    <Button variant="outlined" onClick={addRowToGrid}>Add</Button>
                </Grid>

            </Box>
        </div>
    );
};

export default ItemQuery;