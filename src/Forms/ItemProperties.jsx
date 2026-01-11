import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {extractMessageFromResponse, FormService} from "../FormService.js";
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_INSERT} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {itemCrudRequestTemplate, itemUpdateUrl, queryParameterConfig} from "../Globals.js";
import {ItemDtoToStringWithOperation, ItemDtoToString, ItemRoDTO} from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";

const ItemProperties = (  ) => {

    const [message, setMessage] = useState( "" );
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState( [] );
    const [queryParameters, setQueryParameters ]  = useState(  );

    const[ saveButtonMessage, setSaveButtonMessage ] = useState( "Save Changes" );


    const afterUpdateCallback = ( response ) => {
        console.log( "afterQueryCallback received:", response.status );
        if ( response.status === 200 ) {
            const possibleErrorMessages = extractMessageFromResponse( response );
            if ( possibleErrorMessages.length > 0 ) {
                setMessage( possibleErrorMessages );
                return;
            }
            setRowsOfQueryResults( response.data.data  );
            setMessage( ItemDtoToStringWithOperation( response.data.data[ 0 ] ) );

        } else {
            setMessage( "Error" );
            setRowsOfQueryResults( []  );
        }
    }

    const ItemPropertiesUpdateFormService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        afterPostCallback: afterUpdateCallback,
        requestTemplate : itemCrudRequestTemplate }
    );

    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage( "Insert New Item"  );
                setSaveButtonMessage(  "Insert New Item"  );
                var defaultParams = generateDefaultFromRules( queryParameterConfig );
                defaultParams.crudAction = CRUD_ACTION_INSERT;
                const finalDefaultQueryParameters = {   ...defaultParams,
                    crudAction: ScreenStack.stackTop().activityState };
                setQueryParameters( finalDefaultQueryParameters );
            } else if (ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE) {
                setSaveButtonMessage( "Save Changes" );
                let proposedProperties = ScreenStack.stackTop().data[0];
                proposedProperties.crudAction = CRUD_ACTION_CHANGE;
                setQueryParameters( proposedProperties );
                }
        }
        fetchData();
    }, []); // Dependency array ensures this runs only on mount

    const handleInputChange = ( field ) => {
        return (event) => {
            setQueryParameters( { ...queryParameters, [field]: event.target.value } );
        }
    }

    if ( queryParameters === undefined ) return ( <div>Loading...</div>)

    let workingTabIndex = 0;
    return (
       <div>
           <br/>
            <form onSubmit={ItemPropertiesUpdateFormService.handleSubmit}>
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
                                    ...(col.editable ? {
                                            backgroundColor: '#f5f5f5'
                                        } : {
                                            pointerEvents: 'none'
                                        }
                                    ),
                                    ...(col.hidden === true && {
                                            display: 'none' }
                                    )
                                }}
                            />
                    ))}
                    <Grid container spacing={2} padding={2} size={{xs:12}}>
                        <Button type="submit" variant="contained" name={itemUpdateUrl} tabIndex={workingTabIndex++}>{saveButtonMessage}</Button>
                        <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return without Saving</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ItemProperties;