import React from "react";
import {getValidationRuleByName, validateField} from "./Metadata/Domain.jsx";

/**
 * Generic field validation event handler
 * @param {Event} event - The input event
 * @param {Function} setMessageCallback - Callback to set the error message
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

function PlaceHolderInput(props) {
    const normalizedClassname = props.className ?? 'place-holder-input';
    const domain = getValidationRuleByName( props.name );

    switch (props.type) {
        case 'text':
            return (
                <input
                    type={"text"}
                    name={props.name}
                    className={normalizedClassname}
                    placeholder={props.placeholder}
                    size={domain.maxLength}
                    defaultValue={domain.defaultValue != null ? domain.defaultValue : ''}
                    style={{
                        fontSize: '20px'
                    }}
                    onBlur={(event) => handleFieldValidation(event, props.setMessage, props.whenRequired )}
                />
            )

        case 'password':
            return (
                <input
                    type={"text"}
                    className={normalizedClassname}
                    name={props.name}
                    size={domain.maxLength}
                    placeholder={props.placeholder}
                    value={props.defaultValue != null ? props.defaultValue : ''}
                    style={{
                        fontSize: '20px',
                    }}
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

export default PlaceHolderInput;