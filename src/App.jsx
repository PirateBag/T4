import React, { useState, useEffect } from 'react';
import {ScreenStack} from "./Stack.js";
import Login from './Login.jsx';
import ItemQuery from "./ItemQuery.jsx";
function App() {
    const EMPTY_STACK_SIZE = 0;
    const [stackSize, setStackSize] = useState(EMPTY_STACK_SIZE);

    function setStackLength(size) {
        setStackSize(size);
    }

    useEffect(() => {
        const screenStackLength = ScreenStack.items.length;
        setStackSize(screenStackLength);
        console.log(`Effect has been used.  ${screenStackLength}, ${stackSize}`);
    }, [ScreenStack.stackTop()]);

    console.log(`Stacksize is ${stackSize}`);

    return (
        <React.Fragment>
            Screen Stack length: { stackSize }
            { (stackSize === EMPTY_STACK_SIZE) && <Login visible={true} stackLengthCallback={setStackLength}/>}
            <ItemQuery visible={stackSize > EMPTY_STACK_SIZE} />
        </React.Fragment>
    );
}
export default App;