import React, {useEffect, useState} from 'react';
import ImTextField from "../ImTextField.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import {ItemQueryResultsGrid} from "../ItemQueryResultsGrid.jsx";
import { Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getGridColumns } from '../Metadata/ValidationRulesToGridColumn.jsx';
import GridColDefBuilder, {createDefaultObjectFromGridColumns} from "../Metadata/GridColDefBuilder.js";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
const itemQueryAll = { "updatedRows" : [  ] };

const removeDefaultsFromRow = ( rowWithDefaultValues ) => {
    const newRow = { };
    Object.keys(rowWithDefaultValues).forEach(key => {
        if ( key !== "id" && rowWithDefaultValues[key] !== "*" ) {
            newRow[key] = (rowWithDefaultValues[key] ?? "")
        }
    });
    return newRow;
}

const ItemQuery = (  ) => {

    const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };

    const [message, setMessage] = useState( "" );
    const [queryResults, setQueryResults] = useState( {data: [] } );
    const [queryPrameters, setQueryParameters] = useState( { data:[] } );

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
        const queryParametersMinusDefaults = removeDefaultsFromRow( queryPrameters );

        formService.postData( queryParametersMinusDefaults  );
    }
    function onProcessRowUpdateError( error ) {
        console.log( "onProcessRowUpdateError " + error );
    }


    const GridColumns = ItemQueryEntry();
    const defaultObject = createDefaultObjectFromGridColumns( GridColumns );

    return (
        <div>
            <DataGrid columns={GridColumns}  density="compact" hideFooter  rows={defaultObject}
                      processRowUpdate={ItemQueryRowChange}
            onProcessRowUpdateError={onProcessRowUpdateError}/>;
            <Button variant="outlined" onClick={ItemQueryRowChangeExecute}>Search</Button>
            <br/>
            <hr style={{ margin: "20px 0", borderTop: "1px solid #ccc" }} />
            <br/>
            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
            <ItemQueryResultsGrid data={queryResults.data}  />
            </Box>
        </div>
    );
};

export default ItemQuery;