import React, {useState} from 'react';
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";
import LoginSummary from './Objects/LoginSummary.jsx';

const ItemQuery = ( props ) => {
    const [id, setId]  = useState('1');
    const [summary, setSummary ] = useState('W-00x');

    /*  const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }  */

    if ( !props.visible ) {
        return (
            <div>
            </div>
        );
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let nextScreen = new ScreenTransition( this, 'NONE', null );
        ScreenStack.pushToNextScreen( nextScreen );
    };


    return (
        <div>
                <form onSubmit={handleSubmit}>
                <br/>
                <label>
                    Id:
                    <input type="text" name="id"  onChange={e => setId(e.target.value)}
                           value={id} required/>
                </label>
                <br/>
                <label>
                    Summary:
                    <input type="text" name="summary"     onChange={e => setSummary(e.target.value)}
                           value={summary}
                           required/>
                </label>
                <br/>
                <button type="submit">Query</button>
            </form>
        </div>
    );
};

export default ItemQuery;