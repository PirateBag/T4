import React, {useState} from 'react';
import ImTextField from "../ImTextField.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import DataGridExample from "../DataGridExample.jsx";

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

            <DataGridExample/>

        </div>
    );
};

export default ItemQuery;