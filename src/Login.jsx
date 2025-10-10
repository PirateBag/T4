import React, {useState} from 'react';
import axios from 'axios';
import {ScreenTransition} from "./ScreenTransition.js";
import itemQuery from "./ItemQuery.jsx";
import {ScreenStack} from "./Stack.js";

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
                console.log('New post created:', response.data);
                setMessage("User " + userName + " has logged in");
                let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
                ScreenStack.pushToNextScreen(nextScreen);
                props.stackLengthCallback( 1 );
                console.log( "Response without error"  + ScreenStack.items.length );

            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
        console.log('Fell through to here?post:' );
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
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
