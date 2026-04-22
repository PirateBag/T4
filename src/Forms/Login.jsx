import React, {useState} from 'react';
import "../styles.css";
import ErrorMessage from "../ErrorMessage.jsx";
import FormService from "../FormService.js";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemQuery from "./ItemQuery.jsx";
import Grid from "@mui/material/Grid";
import {LoginRequestEditableMetadata} from "./LoginConfig.js";
import {Button} from "@mui/material";
import {ScreenStack} from "../Stack.js";
import {VerifyCredentialsUrl} from "../Globals.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";

function Login(  )
{
    const [message, setMessage] = useState( "" );
    //  const { currentUser, setCurrentUser } = useContext(UserContext);
    const afterPostCallback = (response) => {
        //  setCurrentUser( new LoginSummary( "fred", response.token, "2025-10-31 2359" ))
        ScreenStack.push(new ScreenTransition( "Item Query", ItemQuery, CRUD_ACTION_NONE, response.data) );
    }

    const [queryParameters, setQueryParameters] = useState( { userName: "fred", password: "dilban" })

    const handleInputChange = (rule) => {
        return (event) => {
            let value = event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            setQueryParameters({...queryParameters, [rule.field]: value});
        }
    }

    const formService = new FormService(
        { messageFormSetter: setMessage,
        messagesFromForm: message,
            afterPostCallback: afterPostCallback,
        }, );

    return (
        <div>
            <form onSubmit={formService.handleSubmit} >
                <ErrorMessage message={message} />

                <PropertyGrid label= "Please enter your credentials"
                              objectToPresent={queryParameters} validationRules={LoginRequestEditableMetadata}
                              handleInputChangeCallback={handleInputChange} layout="column"/>

                    <Grid container sx={{ mt: 1 }} size={{xs: 12}}>
                         <Button type='submit' variant="outlined" name={VerifyCredentialsUrl}>Log In</Button>
                    </Grid>
            </form>
        </div>
    );
}

export default Login;
