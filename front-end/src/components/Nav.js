import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/signup");
  };
  
  return (
    <div>
{
      auth ?
      <ul className="nav-ul">
        <li>
          <Link to="/">Produits</Link>
        </li>
        <li>
          <Link to="/add">Mise en vente</Link>
        </li>
        
        <li>
          <Link to="/profile">Profil</Link>
        </li>
        <li>
          <Link to="/cart">Panier</Link>
        </li>
        <li>
            <Link onClick={logout} to="/signup">
            Déconnexion {JSON.parse(auth).name}
            </Link>
        </li>
      </ul>
      :
      <ul className="nav-ul">
         <li>
         <Link to="/signUp">S'inscrire</Link> 
         </li>
        <li>
          <Link to="/login">Se connecter</Link>
        </li>
      </ul>
}
    </div>
  );
};

export default Nav;
