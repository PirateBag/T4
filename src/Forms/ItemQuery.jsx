import React, {useState} from 'react';
import PlaceHolderInput from "../PlaceHolderInput.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";

export const itemQueryUrl = 'http://localhost:8080/item/crudQuery'
export const itemQueryUrlRequestTemplate = '{ "updatedRows" : [ ${rowWithQuery} ] }';
const ItemQuery = ( props ) => {

    const [message, setMessage] = useState( "" );
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

    let queryResults = { data: [] }
    const afterPostCallback = ( response ) => {
        if ( response.status === 200 ) {
            setMessage( "Success" );
            queryResults = response;
        } else {
            setMessage( "Error" );
            queryResults = { data: [] }
        }
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
                    <PlaceHolderInput type={"text"} name={"id"} placeholder={"Id"}  setMessage={setMessage} />
                    <br/>
                    <PlaceHolderInput type={"text"} name={"summaryId"} placeholder={"SummaryId"}  setMessage={setMessage} />
                    <br/>
                    <PlaceHolderInput type={"text"} name={"description"} placeholder={"Description"}  setMessage={setMessage} />
                    <br/>
                    <button type="submit">Search</button>
                </form>

            Query Results {queryResults.data ?? 'undefined' }

        </div>
    );
};

export default ItemQuery;