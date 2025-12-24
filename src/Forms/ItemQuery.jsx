import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService, isShallowEqual} from "../FormService.jsx";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {queryParameterConfig,queryResultsConfig} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
export const itemUpdateUrl = 'http://localhost:8080/item/crud'

export const itemMasterReportUrl = 'http://localhost:8080/itemReport/showAllItems'
const itemQueryAll = { "updatedRows" : [  ] };

const ItemQuery = (  ) => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState( [] );

    const afterQueryPostedCallback = ( response ) => {
        console.log( "afterQueryCallback received:", response.status );
        if ( response.status === 200 ) {
            setMessage( "Success" );
            setRowsOfQueryResults( response.data.data  );
        } else {
            setMessage( "Error" );
            setRowsOfQueryResults( []  );
        }
    }

    const afterChangeCallback = ( responseFromUpdate ) => {
        if ( responseFromUpdate.status !== 200 ) {
            setMessage( "Error" );
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
        url: itemQueryUrl,
        afterPostCallback: afterQueryPostedCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    const updateFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        url: itemUpdateUrl,
        afterPostCallback: afterChangeCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );


    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                // Trigger search with empty values
                await queryFormService.postData( itemQueryAll );
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
        await updateFormService.postData(objectToBeTransmitted);
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

    return (
        <div>
            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} padding={2}>
                    {queryParameterConfig.map((col) => (
                        <Grid size={{xs: 12, sm: 6}} key={col.field}>
                            <TextField
                                type={col.type}
                                size="small"
                                margin="dense"
                                name={col.domainName}
                                placeholder={col.placeholder}
                                maxLength={col.maxLength}
                                defaultValue={''}
                                sx={{ width: '180px' }}
                            />
                        </Grid>
                    ))}
                    <Grid size={{xs:12}}>
                        <Button type="submit" variant="contained">Search</Button>
                        <Button onClick={clearQueryParameters}>Clear</Button>
                        <Button type="submit" name={itemMasterReportUrl}>Item Master Report</Button>
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