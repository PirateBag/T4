import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {ScreenStack} from "../Stack.js";
import {
    VerifyCredentialsUrlV2
} from "../Globals.js";

import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import * as objectToString from "../lib/ObjectToString.js";
import {LoginRequestEditableMetadata} from "./LoginConfig.js";
import {ScreenTransition} from "../ScreenTransition.js";
import ItemQuery from "./ItemQuery.jsx";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";

const Login2 = () => {

    const [message, setMessage] = useState("");
    const [loginParameters, setLoginParameters] = useState( { userName: "fred", password: "dilban" } );

    const afterPostCallback = () => {
        ScreenStack.push(new ScreenTransition( "Item Query", ItemQuery, CRUD_ACTION_NONE, []) );
    }

    // Consolidate data initialization into a single useEffect
    useEffect(() => {
    }, []); // Runs once on mount

    if (loginParameters === undefined) return (<div>Loading ...</div>)

    return (
        <div>
            <br/>
                <ErrorMessage message={message}/>
                <br/>

                <PropertyGrid
                    label={'Please enter username and password'}
                    objectToPresent={loginParameters}
                    objectSetter={setLoginParameters}
                    validationRules={LoginRequestEditableMetadata}
                    messageFormSetter={setMessage}
                    url={VerifyCredentialsUrlV2}
                    actionLabel='Verify Credentials'
                    objectToStringFormatter={objectToString.objectToStringCredential}
                    postResponseSaveHandler={afterPostCallback}
                />
        </div>
    );
}
export default Login2;
