import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../Button';

const Login = () => {
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const navigate = useNavigate();

  useEffect(()=> { // Si le local storage est déjà occupé, l'utilisateur est renvoyé sur l'onglet products
    const auth = localStorage.getItem('user');
    if(auth){
        navigate('/');
    }
}, [])

function handleFormSubmit(event) {
  event.preventDefault();
}

  const handleLogin = async () => {
  // Test des champs : console.warn(email,password);
  let result = await fetch("http://localhost:5000/login", {
        method:'post',
        body: JSON.stringify({email,password}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    result = await result.json();
    // Vérifie que l'API est connectée console.warn(result);
    // Changes jwt token !!
    if(result.auth){
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', JSON.stringify(result.auth));
      localStorage.setItem('cart', JSON.stringify([])); // Ajout panier + register
      navigate("/");
    } else {
      alert("Please enter correct connect details");
    }
  };
  return (
    <form onSubmit={handleFormSubmit} className="login">
      <h1>Se connecter</h1>
      <label for="email"></label>
      <input
        id="email"
        type="text"
        className="inputBox"
        placeholder="Entrez votre email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <label for="mdp"></label>
      <input
        id="mdp"
        type="text"
        className="inputBox"
        placeholder="Entrez votre mot de passe"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />
      <Button function={handleLogin} text="Connexion"/>
    </form>
  );
};

export default Login;
