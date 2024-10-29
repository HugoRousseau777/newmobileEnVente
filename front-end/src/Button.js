import React from 'react';

function Button(props) {
    
    return (
        <button disabled={props.loading} onClick= {props.function} id={props.id}
        className={["appButton", props.loading && "loading"]
            .filter(e => !!e)
            .join(' ')
        }  type="button">{!props.loading && props.text} 
            <div className={props.loading && "spinner"}></div>
        </button>
    );
}

export default Button;