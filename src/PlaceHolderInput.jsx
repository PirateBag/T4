import React from "react";
import {getValidationRuleByName} from "./Metadata/Domain.jsx";

/**
 * Generic field validation event handler
 * @param {Event} event - The input event
 * @param {Function} setMessageCallback - Callback to set error message
 */
const handleFieldValidation = (event, setMessageCallback) => {
    setMessageCallback(""); // Clear previous messages

    const name = event.target.name;
    const value = event.target.value;

    console.log("Name " + name + " value " + value);

    const resultsOfValidation = validateField(name, value);

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
                    placeholder={props.placeholder}
                    className={normalizedClassname}
                    size={domain.minLength}
                    defaultValue={domain.defaultValue != null ? domain.defaultValue : ''}
                    style={{
                        fontSize: '20px',
                    }}
                    onBlur=={(event) => handleFieldValidation(event, props.setMessage)}
                />
            )

        case 'password':
            return (
                <input
                    type={"password"}
                    name={props.name}
                    size={domain.minLength}
                    placeholder={props.placeholder}
                    className={normalizedClassname}
                    value={props.defaultValue != null ? props.defaultValue : ''}
                    style={{
                        fontSize: '20px',
                    }}
                    onBlur={e => props.onChangeHandler(e)}
                />
            )
    }


    return (
        <input
            type={"text"}
            name={"unsupported type."}
            placeholder={"you have stumbled into an unsupported type."}
            className={normalizedClassname}
            style={{
                fontSize: '20px',
            }}
        />
    );
}

export default PlaceHolderInput;