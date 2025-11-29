import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import {ItemQueryResultsGrid} from "../ItemQueryResultsGrid.jsx";
import { Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import { getGridColumns } from '../Metadata/ValidationRulesToGridColumn.jsx';
import GridColDefBuilder, {createDefaultObjectFromGridColumns} from "../Metadata/GridColDefBuilder.js";
import {queryParameterConfig} from "./ItemQueryConfig.js";
import ImTextField from "../ImTextField.jsx";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
const itemQueryAll = { "updatedRows" : [  ] };


/**
 * Removes any default values from a row.  Only properties with non-default values are returned.
 * @param rowWithQueryCriteria.  Scalar Object, not an array.
 * @param rowOfDefaultValues.  Scalar Object, not an array.  Keys are the same as those in rowWithQueryCriteria.
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

    const GridColumns = ItemQueryEntry();
    const defaultQueryParameters = createDefaultObjectFromGridColumns( GridColumns );

    const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [queryResults, setQueryResults] = useState( { data:[] } );
    const [queryParameters, setQueryParameters] = useState( defaultQueryParameters );

    const afterPostCallback = ( response ) => {
        console.log( "afterPostCallback received:", response );
        if ( response.status === 200 ) {
            setMessage( "Success" );
            setQueryResults( response || emptyResponse );
        } else {
            setMessage( "Error" );
            setQueryResults( response || emptyResponse );
        }
        console.log( "Response " + JSON.stringify( queryResults ));
    }

    const formService = new FormService( { messageFromFormSetter: setMessage,
        buttonLabel: "Search",
        messagesFromForm: message,
        url: itemQueryUrl,
        isValidateForm: false,
        afterPostCallback: afterPostCallback,
        requestTemplate : itemQueryUrlRequestTemplate } );

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

    function ItemQueryEntry() {
        const GridColDefBuilderService = new GridColDefBuilder( getGridColumns() );

        const selectColumns  = [
            { "rawGridfieldName" : "id", "girdfieldOptions" : { editable: false } },
            { "rawGridfieldName" : "description", "girdfieldOptions" : { defaultValue: "*" } },
            { "rawGridfieldName" : "unitCost", "girdfieldOptions" : { defaultValue: "*"  } },
            { "rawGridfieldName" : "sourcing", "girdfieldOptions" : { valueOptions: ["MAN", "PUR", "*"],
                defaultValue: "*" }   },
            { "rawGridfieldName" : "maxDepth", "girdfieldOptions" :  { editable: false,defaultValue: "*"  } },
            { "rawGridfieldName" : "leadTime", "girdfieldOptions" : {defaultValue: "*"  } },
            { "rawGridfieldName" : "quantityOnHand", "girdfieldOptions" : { defaultValue: "*" } } ];
        return GridColDefBuilderService.buildColumnDefs( selectColumns )
    }

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
    /*  function onProcessRowUpdateError( error ) {
        console.log( "onProcessRowUpdateError " + error );
    }  */
    return (
        <div>
            <form onSubmit={formService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                {/* REPLACES THE DATA GRID */}
                <Grid container spacing={2} padding={2}>
                    {queryParameterConfig.map((col) => (
                        <Grid item xs={12} sm={6} md={4} key={col.rawGridfieldName}>
                            <ImTextField
                                type="text"
                                name={col.rawGridfieldName}
                                placeholder={col.rawGridfieldName.toUpperCase()}
                                setMessage={setMessage}
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained">Search</Button>
                    </Grid>
                </Grid>
            </form>

            <hr style={{ margin: "20px 0", borderTop: "1px solid #ccc" }} />

            <br/>
            <Button variant="outlined" onClick={ItemQueryRowChangeExecute}>Search</Button>
            <br/>
            <hr style={{ margin: "20px 0", borderTop: "1px solid #ccc" }} />
            <br/>
            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
                {queryResults.data.length === 0 ? (
                    "No results"
                ) : (
                    <ItemQueryResultsGrid data={queryResults.data} />
                )}
            </Box>
        </div>
    );
};

export default ItemQuery;