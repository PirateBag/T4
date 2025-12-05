import React, {useContext, useState} from 'react';
import "../styles.css";
import ErrorMessage from "../ErrorMessage.jsx";
import {FormService} from "../FormService.jsx";
import LoginSummary from "../Objects/LoginSummary.jsx";
import {UserContext} from "../UserContext.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import {ScreenStack} from "../Stack.js";
import itemQuery from "./ItemQuery.jsx";
import Grid from "@mui/material/Grid";
import {queryParameterConfig} from "./LoginConfig.js";
import {Button} from "@mui/material";
import TextField from "@mui/material/TextField";

function Login(  )
{
    const [message, setMessage] = useState( "" );
    const { setCurrentUser } = useContext(UserContext);
    //  const { queryParameters, setQueryParameters} = useState({ userName: "", password: ""} );

    /* const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setQueryParameters(prevParams => ({
            ...prevParams,
            [name]: value
        }));
    };
*/
    const afterPostCallback = (response) => {
        setCurrentUser( new LoginSummary( "fred", response.token, "2025-10-31 2359" ))
        let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
        ScreenStack.pushToNextScreen(nextScreen);
    }

    const formService = new FormService(
        { messageFromFormSetter: setMessage, url: 'http://localhost:8080/verifyCredentials',
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
                    <Button type='submit' variant="outlined" >Log In</Button>
                </Grid>
            </form>
        </div>
    );
}

export default Login;
