import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse, isShallowEqual} from "../FormService.js";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {ItemQueryParametersDTO,queryResultsConfig} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {DataGrid, useGridApiRef} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemMaster from "./ItemMaster.jsx";
import {ScreenStack} from "../Stack.js";
import {
    itemMasterReportUrl,
    itemQueryAll,
    itemQueryUrl,
    itemCrudRequestTemplate,
    itemUpdateUrl
} from "../Globals.js";
import ItemProperties from "./ItemProperties.jsx";
import {ItemDtoToStringWithOperation} from "./ItemPropertiesConfig.js";


const ItemQuery = (  ) => {

    const apiRef = useGridApiRef();
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
        requestTemplate : itemCrudRequestTemplate }
    );


    const updateFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterChangeCallback,
        requestTemplate : itemCrudRequestTemplate }
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

    function clearQueryParameters( event ) {
        setRowsOfQueryResults(  [] )
        queryFormService.clearFormValues(event );
    }

    function transitionToItemMaster( event ) {
        //  The queryFormService owns the form we want to extract from.
        const objectToBeTransmitted = queryFormService.extractRequestAsObject( event )
        itemMasterFormService.postData(objectToBeTransmitted, itemMasterReportUrl );

        let nextScreen = new ScreenTransition( "Item Master Report", ItemMaster, CRUD_ACTION_NONE, itemMasterQueryResults );
        ScreenStack.push(nextScreen);
    }

    function transitionToItemPropertiesAdd(  ) {
        const nextScreen = new ScreenTransition("Add new item", ItemProperties, CRUD_ACTION_INSERT, []);
        ScreenStack.push(nextScreen);
    }


        const handleCellClick = (params ) => {
        // Check if the clicked cell belongs to the first column (field: 'id')
        if (params.field === ItemQueryParametersDTO[0].field) {
            ScreenStack.push(new ScreenTransition( "Change Item Properties" + ItemDtoToStringWithOperation( rowsOfQueryResults[ params.value -1  ]), ItemProperties, CRUD_ACTION_CHANGE,
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
                </Grid>
                    <Grid container spacing={2} padding={2} size={{xs: 12}}>
                        <Button type="submit" variant="contained" name={itemQueryUrl}>Search</Button>
                        <Button onClick={clearQueryParameters}>Clear</Button>
                        <Button varient="outlined" onClick={transitionToItemMaster} >Item Master Report</Button>

                </Grid>
            </form>

            <hr style={{ margin: "20px 0", borderTop: "1px solid #ccc" }} />

            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
                { rowsOfQueryResults.length === 0 ? (
                    "No results"
                ) : (
                    <DataGrid columns={queryResultsConfig}
                              apiRef={apiRef}
                              rows={ rowsOfQueryResults }
                              density="compact"
                              disableMultipleRowSelection={true}
                              rowSelection={true}
                              onRowSelectionModelChange={(newSelectionModel) => {
                                  // Truncate to single selection if needed
                                  if (newSelectionModel.length > 1) {
                                      apiRef.current.setRowSelectionModel([newSelectionModel[0]]);
                                  }
                              }}
                              getRowId={(row) => row.id}
                              processRowUpdate={ItemQueryRowChange}
                              onCellClick={handleCellClick}
                              onProcessRowUpdateError={(error) => console.error("Row update failed:", error)}
                    />
                ) }
                <Grid container sx={{ mt: 1 }} size={{xs: 12}}>
                    <Button variant="outlined" onClick={transitionToItemPropertiesAdd}>Add</Button>
                </Grid>

            </Box>
        </div>
    );
};

export default ItemQuery;
