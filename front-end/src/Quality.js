import React from 'react';


function Quality(props) {

    return (
        <div>
            <p>{props.text}</p>  
            <div className={"condition containerCondBut" + " " + props.container}>
            <button className="conditionButton" id="perfect" onClick={(e)=> {
                {props.getQuality(e)}
                {props.ButtonQChgStyle(e)}
            }}>Parfait</button> 
            <button className="conditionButton" id="good" onClick={(e)=>{
                {{props.getQuality(e)}};
                {props.ButtonQChgStyle(e)}
            }}>Bon</button> 
            <button className="conditionButton" id="correct" onClick={(e)=>{
                {{props.getQuality(e)}};
                {props.ButtonQChgStyle(e)};
            }}>Correct</button> 
            <button className="conditionButton" id="bad" onClick={(e)=>{
                {{props.getQuality(e)}};
                {props.ButtonQChgStyle(e)};
            }}>Mauvais</button> 
            </div>
        </div>

    );
}

export default Quality;