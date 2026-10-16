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
        if (typeof window !== 'undefined' && window.history && typeof window.history.replaceState === 'function') {
            window.history.replaceState({ stackIndex: 0 }, 'Initial');
        }

        ScreenStack.setOnStackChange((length ) => {
            setStackLength(length);
        });

        const handlePopState = () => {
            ScreenStack.isHandlingPopState = true;
            if (ScreenStack.length() > 1) {
                ScreenStack.popInternal();
            }
            ScreenStack.isHandlingPopState = false;
        };

        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
                window.removeEventListener('popstate', handlePopState);
            }
        };
    }, []);


    const CurrentScreen = ScreenStack.stackTop().nextScreen;

    if (stackLength === 0) { return; }

    return (
        <UserContext1 value={{ currentUser, setCurrentUser }}>
        <Container maxWidth={false}>
            <div>
                <MenuBar currentUser={currentUser}/>
            </div>
                <CurrentScreen/>
        </Container>
        </UserContext1>
    );
}

export default App;
