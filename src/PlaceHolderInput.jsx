import React from "react";
import {getValidationRuleByName} from "./Metadata/Domain.jsx";

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
                    style={{
                        fontSize: '20px',
                    }}
                    onBlur={e => props.onChangeHandler(e)}
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