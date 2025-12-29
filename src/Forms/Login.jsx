import React, {useContext, useState} from 'react';
import "../styles.css";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import LoginSummary from "../Objects/LoginSummary.jsx";
import {UserContext} from "../UserContext.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemQuery from "./ItemQuery.jsx";
import Grid from "@mui/material/Grid";
import {queryParameterConfig} from "./LoginConfig.js";
import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import {ScreenStack} from "../Stack.js";

const VerifyCredentialsUrl = 'http://localhost:8080/verifyCredentials';

function Login(  )
{
    const [message, setMessage] = useState( "" );
    const { setCurrentUser } = useContext(UserContext);
    const afterPostCallback = (response) => {
        setCurrentUser( new LoginSummary( "fred", response.token, "2025-10-31 2359" ))
        ScreenStack.push(new ScreenTransition(ItemQuery, 'ItemQuery', response.data) );
    }

    const formService = new FormService(
        { messageFromFormSetter: setMessage,
        messagesFromForm: message,
            afterPostCallback: afterPostCallback,
        }, );

    return (
        <div>
            <form onSubmit={formService.handleSubmit} >
                <ErrorMessage message={message} />
                <Grid container spacing={2} padding={2} direction="column">
                    {queryParameterConfig.map((col) => (
                        <Grid size={{xs: 12}} key={col.domainName}>
                            <TextField
                                type={col.type}
                                size="small"
                                margin="dense"
                                name={col.domainName}
                                defaultValue={col.defaultValue != null ? col.defaultValue : ''}
                                fontSize="12px"
                                sx={{ width: '200px' }}
                                onBlur={(event) => formService.handleBlurOnTextField(event, col )}
                            />
                        </Grid>
                    ))}
                    <Button type='submit' variant="outlined" name={VerifyCredentialsUrl}>Log In</Button>
                </Grid>
            </form>
        </div>
    );
}

export default Login;
