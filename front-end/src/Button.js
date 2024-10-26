import React from 'react';

function Button(props) {
    return (
        <button onClick={props.function} id={props.id} className="appButton" type="button">{props.text}</button>
    );
}

export default Button;