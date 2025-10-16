import React, {useState} from 'react';
import axios from 'axios';
import {ScreenTransition} from "./ScreenTransition.js";
import itemQuery from "./ItemQuery.jsx";
import {ScreenStack} from "./Stack.js";
import LoginSummary from "./Objects/LoginSummary.jsx"
import PlaceHolderInput from "./PlaceHolderInput.jsx";
import "./styles.css";
import { ValidationRules } from './Metadata/BasicValidation.js';
import {getValidationRuleByName} from "./Metadata/Domain.js";


function Login( props  )
{
    const [userName, ] = useState('fred');
    const [password, ] = useState('dilban');
    const [message, setMessage] = useState( "" );

    if ( !props.visible) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPost = {
                "userName": userName,
                "password": password
        };



        axios.post('http://localhost:8080/verifyCredentials', newPost)
            .then(response => {
                setMessage("User " + userName + " has logged in");
                let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
                ScreenStack.pushToNextScreen(nextScreen);
                props.stackLengthCallback( ScreenStack.items.length, new LoginSummary( userName, response.data.token ));
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    }

    const fieldValidation = (event) => {
        setMessage( "" );
        const name = event.target.name;
        const value = event.target.value;

        console.log( "Name " + name + " value " + value  );

        const resultsOfValidation = getValidationRuleByName( name ).validate( value );

        if( resultsOfValidation != null  ) {
            setMessage( "Validation Rule: " + resultsOfValidation);
            console.log( "Validation Rule: " + resultsOfValidation);
        }
    }

    return (
        <div>

            <form onSubmit={handleSubmit}>
                {message}
                <br/>
                    <PlaceHolderInput type={"text"} name={"userName"} placeholder={"user"}  onChangeHandler={fieldValidation} />
                <br/>
                    <PlaceHolderInput type={"text"} name={"password"} placeholder={"password"} onChangeHandler={fieldValidation} />
                <br/>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
