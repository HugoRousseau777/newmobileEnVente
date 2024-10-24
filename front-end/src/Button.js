import React from 'react';

function Button(props) {
    return (
        <button onClick={props.function} className="appButton" type="button">{props.text}</button>
    );
}

export default Button;