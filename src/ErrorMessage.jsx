import React from 'react';
import './styles.css';

function ErrorMessage({ message }) {
    if (!message || message.length === 0) {
        return null; // Takes no space when empty
    }

    return (
        <div className="error-message">
            {message}
        </div>
    );
}



export default ErrorMessage;