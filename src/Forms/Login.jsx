import React, {useContext, useState} from 'react';
import ImTextField from "../ImTextField.jsx";
import "../styles.css";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import LoginSummary from "../Objects/LoginSummary.jsx";
import {REQUIRED_ADD} from "../Metadata/Domain.jsx";
import Button from '@mui/material/Button';

import {UserContext} from "../UserContext.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import itemQuery from "./ItemQuery.jsx";

function Login(  )
{
    const [message, setMessage] = useState( "" );
    const { setCurrentUser } = useContext(UserContext);

    const afterPostCallback = (response) => {
        setCurrentUser( new LoginSummary( "fred", response.token, "2025-10-31 2359" ))
        let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
        ScreenStack.pushToNextScreen(nextScreen);
    }


    const formService = new FormService( { messageFromFormSetter: setMessage, url: 'http://localhost:8080/verifyCredentials',
        messagesFromForm: message, afterPostCallback: afterPostCallback } );

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
