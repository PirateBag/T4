import React from "react";
import {getValidationRuleByName, validateField} from "./Metadata/Domain.jsx";
import TextField from '@mui/material/TextField';

/**
 * Generic field validation event handler
 * @param {Event} event - The input event
 * @param {Function} setMessageCallback - Callback to set the error message
 * @param whenRequired For the future!
 */
const handleFieldValidation = (event, setMessageCallback, whenRequired) => {
        setMessageCallback(""); // Clear previous messages

        const name = event.target.name;
        const value = event.target.value;

       console.log("Name " + name + " value " + value);

       const resultsOfValidation = validateField(name, value, whenRequired );

       if (resultsOfValidation != null) {
           setMessageCallback(resultsOfValidation);
       }
    };

function ImTextField(props) {
    const normalizedClassname = props.className ?? 'place-holder-input';
    const domain = getValidationRuleByName( props.name );

    switch (props.type) {
        case 'text':
            return (
                <TextField
                    type={"text"}
                    size="small"
                    margin="dense"
                    name={props.name}
                    className={normalizedClassname}
                    placeholder={props.placeholder}
                    maxLength={domain.maxLength}
                    defaultValue={domain.defaultValue != null ? domain.defaultValue : ''}
                    onBlur={(event) => handleFieldValidation(event, props.setMessage, props.whenRequired )}
                />
            )

        case 'password':
            return (
                <TextField
                    type={"text"}
                    size="small"
                    margin="dense"
                    className={normalizedClassname}
                    name={props.name}
                    maxLength={domain.maxLength}
                    placeholder={props.placeholder}
                    defaultValue={domain.defaultValue != null ? domain.defaultValue : ''}
                    onBlur={(event) => handleFieldValidation(event, props.setMessage, props.whenRequired )}
                />
            )
    }


    console.log( "Unsupported placeholder type: " + props.type );
    return (
        <div>
        "Unsupported placeholder type: " + {props.type} on {props.name}
        </div>
    );


}

export default ImTextField;