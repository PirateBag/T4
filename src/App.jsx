import React, {useEffect, useState} from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Forms/Login.jsx';
import './styles.css'
import MenuBar from "./Menubar.jsx";
import LoginSummary from "./Objects/LoginSummary.jsx";
import Container from '@mui/material/Container';
import {UserContext as UserContext1} from "./UserContext.jsx";

function App() {
    const EMPTY_STACK_SIZE = 0;
     //  co[stackSize, setStackSize] = useState(EMPTY_STACK_SIZE);

    const [currentUser, setCurrentUser] = useState( new LoginSummary( "none", "none", "none"));

    const [stackLength, setStackLength] = useState(0);

    // Set up the callback when a component mounts
    useEffect(() => {
        ScreenStack.setOnStackChange((length ) => {
            setStackLength(length);
            // Handle summary if needed
        });
    }, []);

    const CurrentScreen = stackLength === EMPTY_STACK_SIZE ? Login : ScreenStack.stackTop();
    /*
    useEffect(() => {
        const screenStackLength = ScreenStack.items.length;
        setStackSize(screenStackLength);
    }, [ScreenStack.stackTop()]);

    // Assign the component from the stack (or Login default) to a capitalized variable
    // This allows JSX to render it dynamically as an element instance
    const CurrentScreen = stackLength === EMPTY_STACK_SIZE ? Login : ScreenStack.stackTop();

    return (
        <Container>
            <div>
                <MenuBar currentUser={currentUser}/>
            </div>
            /* Render the resolved component */
/*
<CurrentScreen
    visible={true}
    stackLengthCallback={setStackLength}
    setCurentUser={setCurrentUser}
/>
</Container>
);
    */

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
