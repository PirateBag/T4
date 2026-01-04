import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService, isShallowEqual} from "../FormService.jsx";
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {itemQueryAll, itemQueryUrl, itemQueryUrlRequestTemplate, itemUpdateUrl} from "../Globals.js";
import {ItemRoDTO} from "./ItemPropertiesConfig.js";

const ItemProperties = (  ) => {

    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState( [] );
    const [queryParameters, setQueryParameters ]  = useState( () => {
        const stackData = ScreenStack.stackTop().data;
        return (stackData && stackData.length > 0) ? stackData[0] : [];
    });

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


    const queryFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterQueryPostedCallback,
        requestTemplate : itemQueryUrlRequestTemplate }
    );

    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                // Trigger search with empty values
                await queryFormService.postData( itemQueryAll, itemQueryUrl );
            }
        };
        fetchData();
    }, []); // Dependency array ensures this runs only on mount

    const handleInputChange = ( field ) => {
        return (event) => {
            setQueryParameters( { ...queryParameters, [field]: event.target.value } );
        }
    }

    let workingTabIndex = 0;
    return (
       <div>
           <br/>
            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} padding={2}>
                    {ItemRoDTO.map((col) => (
                            <TextField
                                type={col.type}
                                key={col.headerName}
                                size="small"
                                margin="dense"
                                name={col.domainName}
                                placeholder={col.placeholder}
                                value={queryParameters[col.field]}
                                label={col.headerName}
                                onChange={handleInputChange(col.field)}
                                inputProps={{
                                    maxLength:50
                                }}
                                sx={{
                                    width: '240px',
                                    ...(col.editable === false && {
                                        pointerEvents: 'none',
                                        backgroundColor: '#f5f5f5'
                                    })
                            }}
                            />
                    ))}
                    <Grid container spacing={2} padding={2} size={{xs:12}}>
                        <Button type="submit" variant="contained" name={itemQueryUrl} tabIndex={workingTabIndex++}>Save</Button>
                        <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ItemProperties;