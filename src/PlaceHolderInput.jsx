import React from "react";

function PlaceHolderInput( props ) {
    const normalizedClassname = props.className ?? 'place-holder-input';
    return (
        <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            className={normalizedClassname}
            style={{
                fontSize: '20px',
            }}
            onBlur={e => props.onChangeHandler(e)}
        />
)
    ;
}

export default PlaceHolderInput;