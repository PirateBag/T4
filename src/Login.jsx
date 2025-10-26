import React, {useState} from 'react';
import PlaceHolderInput from "./PlaceHolderInput.jsx";
import "./styles.css";
import ErrorMessage from "./ErrorMessage.jsx";
import {FormService} from "./FormService.jsx";


function Login( props  )
{
    const [message, setMessage] = useState( "" );
    const formService = new FormService( { messageFromFormSetter: setMessage,
        messagesFromForm: message,
        url: 'http://localhost:8080/verifyCredentials' } );

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
/*
    const handleSubmit = async (event) => {
        event.preventDefault();

        let messagesFromFormValidation = validateAllFieldsOnForm(event);
        setMessage( messagesFromFormValidation );

        if ( messagesFromFormValidation.length > 0 ) return;

        const formData = new FormData(event.target);
        const newPost = Object.fromEntries(formData.entries());

        axios.post('http://localhost:8080/verifyCredentials', newPost)
            .then(response => {
                setMessage("User has logged in");
                let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
                ScreenStack.pushToNextScreen(nextScreen);
                props.stackLengthCallback( ScreenStack.items.length, new LoginSummary( newPost.userName, response.data.token ));
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    }

    /*
    const fieldValidation = (event) => {
        setMessage( "" );
        const name = event.target.name;
        const value = event.target.value;

        console.log( "Name " + name + " value " + value  );

        const resultsOfValidation = getValidationRuleByName( name ).validate( value );

        if( resultsOfValidation != null  ) {
            setMessage(  resultsOfValidation );
        }

    }
*/

    return (
        <div>
            <form onSubmit={formService.handleSubmit}>
                <ErrorMessage message={message} />
                <br/>
                    <PlaceHolderInput type={"text"} name={"userName"} placeholder={"user"} setMessage={setMessage} />
                <br/>
                    <PlaceHolderInput type={"text"} name={"password"} placeholder={"password"}  setMessage={setMessage} />
                <br/>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
