import React from 'react';

function MenuBar( props ) {
    return (
        <nav style={{ backgroundColor: '#f8f9fa', padding: '10px' }}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0, overflow: 'hidden' }}>
                <li style={{ float: 'left' }}>
                    <a href="#" style={{ display: 'block', color: '#000', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>Home</a>
                </li>
                <li style={{ float: 'left' }}>
                    <a href="#" style={{ display: 'block', color: '#000', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>About</a>
                </li>
                <li style={{ float: 'left' }}>
                    <a href="#" style={{ display: 'block', color: '#000', textAlign: 'center', padding: '14px 16px', textDecoration: 'none' }}>{props.currentUser.toString()}</a>
                </li>
            </ul>
        </nav>
    );
}

export default MenuBar;
