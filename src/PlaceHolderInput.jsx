function PlaceHolderInput( props ) {
    return (
        <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            className='place-holder-input'
            style={{
                fontSize: '20px',
            }}
        />
    );
}

export default PlaceHolderInput;