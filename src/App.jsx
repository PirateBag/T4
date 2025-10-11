import React, { useState, useEffect } from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Login.jsx';
import ItemQuery from "./ItemQuery.jsx";
import './styles.css'
import MenuBar from "./Menubar.jsx";

function App() {
    const EMPTY_STACK_SIZE = 0;
    const [stackSize, setStackSize] = useState(EMPTY_STACK_SIZE);

    function setStackLength(size) {
        setStackSize(size);
    }

    useEffect(() => {
        const screenStackLength = ScreenStack.items.length;
        setStackSize(screenStackLength);
    }, [ScreenStack.stackTop()]);


    return (
        <React.Fragment>
            <div>
                <MenuBar/>

            </div>
            {(stackSize === EMPTY_STACK_SIZE) && <Login visible={true} stackLengthCallback={setStackLength}/>}
            <ItemQuery visible={stackSize > EMPTY_STACK_SIZE}/>
        </React.Fragment>
    );
}

export default App;