import React, { useState, useEffect } from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Login.jsx';
import ItemQuery from "./ItemQuery.jsx";
import './styles.css'

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
            <header style={{height: '100px', backgroundColor: 'antiquewhite'}}>
                {/* Replace 'Header Content' with your own content */}
                <h1>Inman</h1>
            </header>
            </div>
            {(stackSize === EMPTY_STACK_SIZE) && <Login visible={true} stackLengthCallback={setStackLength}/>}
            <ItemQuery visible={stackSize > EMPTY_STACK_SIZE}/>
        </React.Fragment>
    );
}

export default App;