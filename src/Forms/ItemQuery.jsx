import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {queryParameterConfig,queryResultsConfig} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
const itemQueryAll = { "updatedRows" : [  ] };


/**
 * Removes any default values from a row.  Only properties with non-default values are returned.
 * @param rowWithQueryCriteria.  Scalar Object, not an array.
 * @param rowOfDefaultValues.  Scalar Object, not an array.  Keys are the same as those in a rowWithQueryCriteria.
 * @returns A new object with only non-default values.  If all values are default, returns an empty object
 */
const removeDefaultsFromRow = ( rowWithQueryCriteria, rowOfDefaultValues  ) => {
    const newRow = { };
    Object.keys(rowWithQueryCriteria).forEach(key => {
        if ( rowOfDefaultValues[key] !== rowWithQueryCriteria[ key ] ) {
            newRow[key] = (rowWithQueryCriteria ?? "")
        }
    });
    return newRow;
}

const ItemQuery = (  ) => {

    //  const GridColumns = ItemQueryEntry();
    const defaultQueryParameters =  {}; //createDefaultObjectFromGridColumns( GridColumns );

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [queryResults, setQueryResults] = useState( { data:[] } );
    const [queryParameters, setQueryParameters] = useState( defaultQueryParameters );

    const afterPostCallback = ( response ) => {
        console.log( "afterPostCallback received:", response );
        if ( response.status === 200 ) {
            setMessage( "Success" );
            setQueryResults( response  );
        } else {
            setMessage( "Error" );
            setQueryResults( response  );
        }
        console.log( "Response " + JSON.stringify( queryResults ));
    }

    const formService = new FormService( { messageFromFormSetter: setMessage,
        buttonLabel: "Search",
        messagesFromForm: message,
        url: itemQueryUrl,
        isValidateForm: false,
        afterPostCallback: afterPostCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (queryResults.data.length === 0) {
                // Trigger search with empty values
                await formService.postData( itemQueryAll );
            }
        };
        fetchData();
    }, []); // Dependency array ensures this runs only on mount


    function ItemQueryRowChange( newValue, oldValue, rowNode, column, api ) {
        console.log( "ItemQueryRowChange " + JSON.stringify( oldValue  ));
        console.log( "ItemQueryRowChange " + rowNode, column, api );
        setQueryParameters( newValue )
        return newValue;
    }
    function ItemQueryRowChangeExecute() {
        const queryParametersMinusDefaults = removeDefaultsFromRow( queryParameters, defaultQueryParameters[  0 ] );
        const queryParametersAfterWrapping = formService.singleRowToRequest( queryParametersMinusDefaults );
        console.log( "ItemQueryRowChangeExecute " + JSON.stringify( queryParametersAfterWrapping ))
        formService.postData( queryParametersAfterWrapping  );
    }

    function clearQueryParameters() {
        setQueryParameters( defaultQueryParameters );
        setQueryResults(  { data:[] } )
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
            <form onSubmit={formService.handleSubmit}>
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
                {queryResults.data.length === 0 ? (
                    "No results"
                ) : (
                    <DataGrid columns={queryResultsConfig} rows={queryResults.data.data} density="compact" />
                ) }
            </Box>
        </div>
    );
};

export default ItemQuery;