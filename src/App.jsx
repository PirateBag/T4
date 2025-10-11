import React, { useState, useEffect } from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Login.jsx';
import ItemQuery from "./ItemQuery.jsx";
import './styles.css'
import MenuBar from "./Menubar.jsx";
import LoginSummary from "./Objects/LoginSummary.jsx";

function App() {
    const EMPTY_STACK_SIZE = 0;
    const [stackSize, setStackSize] = useState(EMPTY_STACK_SIZE);
    const [currentUser, setCurrentUser] = useState( new LoginSummary( "none", "none", "none"));

    function setStackLength(size, newCurrentUser ) {
        setStackSize(size);
        setCurrentUser( newCurrentUser );
    }

    useEffect(() => {
        const screenStackLength = ScreenStack.items.length;
        setStackSize(screenStackLength);
    }, [ScreenStack.stackTop()]);


    return (
        <React.Fragment>
            <div>
                <MenuBar CurrentUser={currentUser}/>

            </div>
            {(stackSize === EMPTY_STACK_SIZE) && <Login visible={true} stackLengthCallback={setStackLength}/>}
            <ItemQuery visible={stackSize > EMPTY_STACK_SIZE}/>
        </React.Fragment>
    );
}

export default App;