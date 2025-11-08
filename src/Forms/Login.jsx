import React, {useState} from 'react';
import ImTextField from "../ImTextField.jsx";
import "../styles.css";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import LoginSummary from "../Objects/LoginSummary.jsx";
import {REQUIRED_ADD} from "../Metadata/Domain.jsx";
import Button from '@mui/material/Button';

function Login( props  )
{
    const [message, setMessage] = useState( "" );
    const [response, setResponse] = useState( {status:"", userName: "", token: "" } );

    const afterPostCallback = (response) => {
        setResponse( response );
        props.setCurentUser( new LoginSummary( "fred", response.token, "2025-10-31 2359" ))
    }

    const formService = new FormService( { messageFromFormSetter: setMessage, url: 'http://localhost:8080/verifyCredentials',
        messagesFromForm: message, afterPostCallback: afterPostCallback } );


    if ( !props.visible) return null;

    /**
     *
     * @param event belonging to a form.  One of the "submit" buttons.
     * @returns {string} contains error messages if any.  Otherwise, zero length string.
     */
/*    const validateAllFieldsOnForm = (event) => {

        const formData = new FormData(event.target);
        const fieldsForValidation = Object.fromEntries(formData.entries());
        let combinedMessages = "";


        for (const [key, value] of Object.entries(fieldsForValidation)) {
            console.log(key + " " + value);
            const resultsOfValidation = getValidationRuleByName(key).validate(value);
            if (resultsOfValidation != null) {
                combinedMessages = combinedMessages + "\n" + resultsOfValidation;
            }
        }
        return combinedMessages;
    }
*/

    return (
        <div>
            <form onSubmit={formService.handleSubmit} >
                <ErrorMessage message={message} />
                <br/>
                    <ImTextField type={"text"} name={"userName"} placeholder={"user"} setMessage={setMessage} whenRequired={REQUIRED_ADD} />
                <br/>
                    <ImTextField type={"text"} name={"password"} placeholder={"password"} setMessage={setMessage} whenRequired={REQUIRED_ADD} />
                <br/>
                <Button type='submit' variant="outlined" >Log In</Button>
            </form>
        </div>
    );
}

export default Login;
