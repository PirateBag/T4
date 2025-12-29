import React, {useEffect, useState} from 'react';
import {FormService, isShallowEqual} from "../FormService.jsx";
import { Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import {DataGrid} from "@mui/x-data-grid";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {textReportConfig} from "./ItemMasterConfig.js";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
export const itemUpdateUrl = 'http://localhost:8080/item/crud'

export const itemMasterReportUrl = 'http://localhost:8080/itemReport/showAllItems'
const itemQueryAll = { "updatedRows" : [  ] };

const ItemMaster = (  ) => {

    //  const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };
    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([] );

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
        afterPostCallback: afterQueryPostedCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    const updateFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterChangeCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );


    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                // Trigger search with empty values
                await queryFormService.postData( itemQueryAll, itemMasterReportUrl );
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
        await updateFormService.postData(objectToBeTransmitted, itemUpdateUrl );
        return updatedRow
    }

    function addRowToGrid( event ) {
        const newRow = { id: parseInt( event.timeStamp *100 ).toString(), crudAction: 'CRUD_ACTION_INSERT', description: "description",
            sourcing: "PUR", quantityOnHand: "0", minimumOrderQuantity: 0.0, unitCost: "0.00", leadTime: 1 };

        setRowsOfQueryResults( rowsOfQueryResults.concat( newRow ));
    }

    if (rowsOfQueryResults.length > 0)  {
        var counter = 1;
        rowsOfQueryResults.map((row) => row.id = counter++ );
    }

    return (
        <div>
            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
                { rowsOfQueryResults.length === 0 ? (
                    "No results"
                ) : (
                    <DataGrid columns={textReportConfig}
                              rows={ rowsOfQueryResults }
                              density="compact" />
                ) }
                <Grid size={{xs:12}}>
                    <Button variant="outlined" onClick={addRowToGrid}>Add</Button>
                </Grid>

            </Box>
        </div>
    );
};

export default ItemMaster;