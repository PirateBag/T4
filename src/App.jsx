import React, { useState, useEffect } from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Forms/Login.jsx';
import ItemQuery from "./Forms/ItemQuery.jsx";
import './styles.css'
import MenuBar from "./Menubar.jsx";
import LoginSummary from "./Objects/LoginSummary.jsx";
import Container from '@mui/material/Container';

function App() {
    const EMPTY_STACK_SIZE = 0;
     //  co[stackSize, setStackSize] = useState(EMPTY_STACK_SIZE);
    const [currentUser, setCurrentUser] = useState( new LoginSummary( "none", "none", "none"));

    /*
    function setStackLength(size, newCurrentUser ) {
        setStackSize(size);
        setCurrentUser( newCurrentUser );
    }
*/
    const [stackLength, setStackLength] = useState(0);

    // Set up the callback when a component mounts
    useEffect(() => {
        ScreenStack.setOnStackChange((length ) => {
            setStackLength(length);
            // Handle summary if needed
        });
    }, []);


    /*
    useEffect(() => {
        const screenStackLength = ScreenStack.items.length;
        setStackSize(screenStackLength);
    }, [ScreenStack.stackTop()]);
    */

    return (
        <Container>
            <div>
                <MenuBar currentUser={currentUser}/>
            </div>
                <Login visible={stackLength === 0 } stackLengthCallback={setStackLength} setCurentUser={setCurrentUser} />
                <ItemQuery visible={stackLength > EMPTY_STACK_SIZE}/>
        </Container>
    );
}

export default App;
