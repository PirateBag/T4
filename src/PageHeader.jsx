import React, {useState} from 'react';
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";


const PageHeader = ( props ) => {
    const [id, setId]  = useState('1');
    const [summary, setSummary ] = useState('W-00x');

    /*  const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }  */

    const handleSubmit = async (event) => {
        event.preventDefault();
        let nextScreen = new ScreenTransition( this, 'NONE', null );
        ScreenStack.pushToNextScreen( nextScreen );
    };


    return (
        <div>

        </div>
    );
};

export default ItemQuery;