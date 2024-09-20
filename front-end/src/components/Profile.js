import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/*Modif: Page Profil */
const Profile=()=>{
    const auth = localStorage.getItem("user");
    const dateInscription = (JSON.parse(auth).createdAt).slice(0,10);
    const user = JSON.parse(localStorage.getItem("user"));
    const [total, setTotal] = useState(0);
    const [totalArticles, setTotalArticles] = useState();
    const [carts, setCarts] = useState([]);
    const [sellingProducts, setSellingProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [totalSold, setTotalSold] = useState(0);
    
    const userId = user._id;
   
    useEffect(()=> {
        getCarts();
        getOwnSellingProducts();
        gelSoldProducts();
    }, [])
   
    
    const getAllTheCarts = async()=> {
        let result = await fetch("http://localhost:5000/carts");
        result = await result.json();
    }
    getAllTheCarts();

    //Ajout pour pouvoir supprimer/modifier ses propres produits mis en vente

    const getOwnSellingProducts = async()=> {
        let a = []; // Using setArray(Array.push(...)) doesnt work !
        let result = await fetch("http://localhost:5000/products");
        result = await result.json();
        result = Array.from(result);
        result.forEach((product)=> {
            if(userId === product.userId){
                a.push(product);
            }
        })
        setSellingProducts(a);
    }

    const gelSoldProducts = async ()=> {
        let a = [];
        let result = await fetch("http://localhost:5000/carts");
        result = await result.json();
        result = Array.from(result);
        result.forEach((command)=> {
            for(let i=0; i<command.cart.length; i++){
                if(userId === command.cart[i].userId){
                    a.push(command.cart[i]);
                }
            }
        })
        for(let i=0; i<a.length;i++){
            setSoldProducts(soldProducts.push(a[i]));
        }
        //setSoldProducts(a);
        setSoldProducts(soldProducts);
        getTotalSold();
    }

    const getTotalSold = ()=> {
        let totalounenou = 0;
        for(let i=0; i<soldProducts.length; i++){
            totalounenou += soldProducts[i].price;
        }
        setTotalSold(totalounenou);
    }
    

    const getCarts = async()=> {
        let result = await fetch(`http://localhost:5000/cart/${userId}`, {
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
            });
        result = await result.json();
        setCarts(carts.concat(result));
        setCarts(result);
        let interArticles = 0;
        let interTotal = 0;
        for(let i=0; i<result.length;i++){
            interArticles += result[i].cart.length;
            interTotal += result[i].total;
        }
        setTotalArticles(interArticles);
        setTotal(interTotal);
        }

        const deleteProduct= async(id)=>{
            let result = await fetch(`http://localhost:5000/${id}`, {
                method:"Delete",
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            if(result){
                alert("Product deleted");
                getOwnSellingProducts();
            } else {
                alert("Nothing happened !")
            }        
        }

    return (
        <>
        <h1>Bienvenue {JSON.parse(auth).name} !</h1>
        <p id="registrationDate">Inscrit le {dateInscription}</p>
        <div className="inSellingProcess">
        <h2>Vos mobiles en vente : </h2>
        <div className="sellingContainer">
            {
                sellingProducts.map((item, key)=> 
                    <div className="sellingArticle">
                        <p className="greasy">{item.name}</p>
                        <p>{item.price} €</p>
                        <p>{item.condition}</p>
                        <p>{item.company}</p>
                        <div className="optionsSelling">
                        <button className="super-button" onClick={()=>{deleteProduct(item._id)}}>Retirer</button>
                       <Link to={"/update/" + item._id}><a className="super-button">Modifier</a></Link>
                       </div>
                    </div>
                )
            }
        </div>
        </div>
       
       <div className="sold-products">
           <h2>Vos mobiles vendus :</h2>
        <div className="soldContainer">
            {
                soldProducts.map((item)=> 
                    <div className="soldArticle">
                        <p className="greasy">{item.name}</p>
                        <p>{item.price} €</p>
                        <p>{item.condition}</p>
                        <p>{item.company}</p>
                    </div>
                )
            }
        </div>
            <p className="totauxTotaux">Nombre d'articles vendu en tout : {soldProducts.length}</p>
        <p className="totauxTotaux">Volume de vente total : {totalSold} €</p>
        </div>
        
        <div className="containerPurchases">
        <h2>Récapitulatif de vos commandes ({carts.length}):</h2>
        {
            carts.map((item)=> 
                <ul className="commande">
                    <li className="dateCommande">{item.createdAt}</li>
                    <li>Total de la commande : {item.total} €</li>
                    <li>nombres d'articles : {item.cart.length}</li>
                    <li className="listeArticles">
                        <ul>Liste des articles : {item.cart.map((item)=> 
                        <li> {item.name}</li>)}
                        </ul>
                    </li>
                </ul>
            )
        }
        <p className="totauxTotaux">Nombre d'articles total : {totalArticles}</p>
        <p className="totauxTotaux">Volume d'achat total : {total} €</p>
        </div>
        </>
    )
}

export default Profile;
