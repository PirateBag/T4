import React, {useEffect, useState} from 'react';
import {ScreenStack} from "./Stack.js";
import './styles.css'
import MenuBar from "./Menubar.jsx";
import LoginSummary from "./Objects/LoginSummary.jsx";
import Container from '@mui/material/Container';
import {UserContext as UserContext1} from "./UserContext.jsx";

function App() {

    const [currentUser, setCurrentUser] = useState( new LoginSummary( "none", "none", "none"));
    const [ stackLength, setStackLength] = useState( -1 );

    // Set up the callback when a component mounts
    useEffect(() => {
        ScreenStack.setOnStackChange((length ) => {
            setStackLength(length);
        });
    }, []);


    const CurrentScreen = ScreenStack.stackTop().nextScreen;
    console.log( "CurrentScreen is " + ScreenStack.stackTop().activityState );
    console.log( "The stack size is " + stackLength );

    return (
        <UserContext1 value={{ currentUser, setCurrentUser }}>
        <Container>
            <div>
                <MenuBar currentUser={currentUser}/>
            </div>
                <CurrentScreen/>
        </Container>
        </UserContext1>
    );
}

export default App;
