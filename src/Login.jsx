import React, {useState} from 'react';
import axios from 'axios';
import {ScreenTransition} from "./ScreenTransition.js";
import itemQuery from "./ItemQuery.jsx";
import {ScreenStack} from "./Stack.js";
import LoginSummary from "./Objects/LoginSummary.jsx"
import PlaceHolderInput from "./PlaceHolderInput.jsx";
import "./styles.css";


function Login( props  )
{
    const [userName, setUserName] = useState('fred');
    const [password, setPassword] = useState('dilban');
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {message}
                <br/>
                <label>
                    Username:
                    <input type="text" name="userName" onChange={e => setUserName(e.target.value)}
                           value={userName} required/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="text" name="password" onChange={e => setPassword(e.target.value)}
                           value={password}
                           required/>
                </label>
                <br/>
                <PlaceHolderInput type={"text"} name={"clown"} placeholder={"entefffrff the clone"} className="place-holder-input"/>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
