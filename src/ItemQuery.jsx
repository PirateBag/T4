import React, {useState} from 'react';
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";
import LoginSummary from './Objects/LoginSummary.jsx';
import PlaceHolderInput from "./PlaceHolderInput.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import {FormService} from "./FormService.jsx";

export const itemQueryUrl = 'http://localhost:8080/verifyCredentials'
const ItemQuery = ( props ) => {



    const [message, setMessage] = useState( "" );
    /*  const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }  */

    const formService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        url: 'http://localhost:8080/verifyCredentials' } );

    if ( !props.visible ) {
        return (
            <div>
            </div>
        );
    }



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
                    <button type="submit">Log In</button>
                </form>
        </div>
    );
};

export default ItemQuery;