import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService, isShallowEqual} from "../FormService.jsx";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {queryParameterConfig,queryResultsConfig} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_NONE} from "../crudAction.js";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemUpdateUrl = 'http://localhost:8080/item/crud'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
const itemQueryAll = { "updatedRows" : [  ] };

const ItemQuery = (  ) => {

    //  const GridColumns = ItemQueryEntry();
    const defaultQueryParameters =  {}; //createDefaultObjectFromGridColumns( GridColumns );

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState( [] );
    const [queryParameters, setQueryParameters] = useState( defaultQueryParameters );

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

        /*
        * updatedResponse:  updatedResponse.data[]
        * queryResults.data.data[]
        *
        *  */
        const updatedRow = responseFromUpdate.data.data[0];
        updatedRow.crudAction = CRUD_ACTION_NONE;
        const newRowsOfData = rowsOfQueryResults.map((row) =>
                row.id === updatedRow.id ? updatedRow : row
            );
/*
// if you keep `response` in state, set it immutably:
            setResponse((prev) => ({
                ...prev,
                data: prev.data.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
            }));
*/

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

        newValue.crudAction = CRUD_ACTION_CHANGE;
        const updatedRow = {...newValue};

        /*
        // 2. Update state immutably, preserving the axios response structure
        setQueryResults(prevResults => {
            // Guard against empty state
            if (!prevResults?.data?.data) return prevResults;

            // Create shallow copies of the nested structure
            const newResults = { ...prevResults };
            newResults.data = { ...prevResults.data };

            // Map the array to find and replace the changed row by ID
            newResults.data.data = prevResults.data.data.map(row =>
                row.id === updatedRow.id ? updatedRow : row
            );
            return newResults;
        });

         */
        const objectToBeTransmitted = queryFormService.singleRowToRequest(updatedRow);
        await updateFormService.postData(objectToBeTransmitted);
        return updatedRow
    }

    function clearQueryParameters() {
        setQueryParameters( defaultQueryParameters );
        setRowsOfQueryResults(  [] )
    }
/*
    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setQueryParameters(prevParams => ({
            ...prevParams,
            [name]: value
        }));
    };

    /*  function onProcessRowUpdateError( error ) {
        console.log( "onProcessRowUpdateError " + error );
    }  */
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
                                //  onChange={props.onChange}
                                sx={{ width: '180px' }}
                                //  onBlur={(event) => handleFieldValidation(event, props.setMessage, props.whenRequired )}
                            />
                        </Grid>
                    ))}
                    <Grid size={{xs:12}}>
                        <Button type="submit" variant="contained">Search</Button>
                        <Button variant="outlined" onClick={clearQueryParameters}>Clear</Button>
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
            </Box>
        </div>
    );
};

export default ItemQuery;