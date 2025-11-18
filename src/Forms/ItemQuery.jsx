import React, {useState} from 'react';
import ImTextField from "../ImTextField.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import {ItemQueryResultsGrid2} from "../ItemQueryResultsGrid2.jsx";
import * as PropTypes from "prop-types";
import { Button, Box } from '@mui/material';

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';


const ItemQuery = ( props ) => {

    const emptyResponse = { responseType: "MULTILINE", data: [], errors : []  };

    const [message, setMessage] = useState( "" );
    const [queryResults, setQueryResults] = useState( {data: [] } );

    /*  const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }  */

    if ( !props.visible ) {
        return (
            <div>
            </div>
        );
    }

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

    return (
        <div>

            <form onSubmit={formService.handleSubmit}>
                    <ErrorMessage message={message}/>
                    <br/>
                    <ImTextField type={"text"} name={"id"} placeholder={"Id"} setMessage={setMessage} />
                    <br/>
                    <ImTextField type={"text"} name={"summaryId"} placeholder={"SummaryId"} setMessage={setMessage} />
                    <br/>
                    <ImTextField type={"text"} name={"description"} placeholder={"Description"} setMessage={setMessage} />
                    <br/>
                    <button type="submit">Search</button>
                </form>
            <Box sx={{ height: 400, width: '100%', mb: 10 }}>
            <ItemQueryResultsGrid2 data={queryResults.data}/>
            </Box>
        </div>
    );
};

export default ItemQuery;