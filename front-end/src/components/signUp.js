import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';

const SignUp=()=>{
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [invalidEmail, setInvalidEmail]=useState(false);
    const [password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [error, setError] = React.useState(false);
    const [doubleName, setDoubleName] = React.useState(false);
    const [doubleEmail, setDoubleEmail] = React.useState(false);
    const [emailProposition, setEmailProposition] = React.useState('');
    const [nameProposition, setNameProposition] = React.useState('');


// https://uuu-3fwk.onrender.com/register
// https://uuu-3fwk.onrender.com/register

    const navigate = useNavigate();
    useEffect(()=> {

    const auth = localStorage.getItem('user');

    if(auth){
        navigate('/');
    }
    }, [])
    
    function handleFormSubmit(event) {
        event.preventDefault();
      }

    const collectData=async()=> {        
            let result = await fetch("https://uuu-3fwk.onrender.com/register", { /*Remplacement du localhost pour connecter le BA au FE  */
            method:'post',
            body:JSON.stringify({name, email, password, confirmPassword}),
            headers:{
                'Content-Type':'application/json'
            }
        });
            result= await result.json();  
            if(!name || !email || !password || !confirmPassword){
                setError(true);
                return false;
            }
            if(result.auth){
            localStorage.setItem("user",JSON.stringify(result.result)); // Faire en sorte d'avoir user
            localStorage.setItem('token', JSON.stringify(result.auth));
            localStorage.setItem('cart', JSON.stringify([])); 
            navigate("/"); 
            }

            // Double name and/or email
            if(result.newName){
                setDoubleName(true);
                setNameProposition(result.newName); 
            }
            if(result.newEmail){
                setDoubleEmail(true);
                setEmailProposition(result.newEmail);
            }
            if(result.email){
                setInvalidEmail(true);
            }
    };
       
    return (
        <div className='blueBackG'>
            <form onSubmit={handleFormSubmit} className="register">
            <h1>Inscription</h1>
            <label htmlFor="nom"></label>
            <input id="nom" className="inputBox" type="text" placeholder="Entrez un nom"
            value={name} onChange={(e)=>setName(e.target.value)}
            />
            {error && !name && <span className='invalid-input-register'>Entrez un nom !</span>}
            {doubleName && <span className='invalid-input-register'>Déjà pris ! voici une suggestion pour vous : {nameProposition}</span>}
            <label htmlFor="email"></label>
            <input id="email" className="inputBox" type="text" placeholder="Entrez un email"
            value={email} onChange={(e)=>setEmail(e.target.value)}
            />
            {error && !email && <span className='invalid-input-register'>Entrez un email !</span>}
            {doubleEmail && <span className='invalid-input-register'>Déjà pris ! voici une suggestion pour vous : {emailProposition}</span>}
            {invalidEmail && <span className='invalid-input-register'>Désolé, mais l'email n'a pas une forme valide.</span>}
            <label htmlFor="mdp"></label>          
            <input id="mdp" className="inputBox" type="password" placeholder="Entrez un mot de passe"
            value = {password} onChange={(e)=>setPassword(e.target.value)}
            />
            {error && !password && <span className='invalid-input-register'>Choisissez votre mot de passe !</span>}
            <label htmlFor="mdpC"></label>
            <input id="mdpC" className="inputBox" type="password" placeholder="Confirmez votre mot de passe !"
            value = {confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
            />
            {error && !confirmPassword && <span className='invalid-input-register'>Confirmez votre mot de passe !</span>}
        </form>
        <Button function={collectData} text="Inscription"/>

        </div>   
    )
}

export default SignUp;
