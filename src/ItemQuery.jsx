import React, {useState} from 'react';
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";
import LoginSummary from './Objects/LoginSummary.jsx';
import PlaceHolderInput from "./PlaceHolderInput.jsx";

const ItemQuery = ( props ) => {

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        let nextScreen = new ScreenTransition( this, 'NONE', null );
        ScreenStack.pushToNextScreen( nextScreen );
    };


    return (
        <div>
                <form onSubmit={handleSubmit}>
                <br/>
                    <PlaceHolderInput type={"text"} name={"userName"} placeholder={"user"} onChangeHandler={fieldValidation} />
                    <br/>
                    <PlaceHolderInput type={"text"} name={"password"} placeholder={"password"} onChangeHandler={fieldValidation} />

                <button type="submit">Query</button>
            </form>
        </div>
    );
};

export default ItemQuery;