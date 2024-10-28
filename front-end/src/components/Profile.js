import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

    useEffect(()=> {
        getTotalSold();
    }, [soldProducts])
   
    //Ajout pour pouvoir supprimer/modifier ses propres produits mis en vente

    const getOwnSellingProducts = async()=> {
        let result = await fetch("https://uuu-3fwk.onrender.com/products");
        result = await result.json();  
        result = result.filter((i)=> i.userId == userId);
        setSellingProducts(result);
    }

    const gelSoldProducts = async ()=> {
        let productsSold = [];
        let result = await fetch("https://uuu-3fwk.onrender.com/carts");
        result = await result.json();

        result.forEach((command)=> {
            productsSold = productsSold.concat(command.cart.filter((i)=> i.userId == userId))
        })

        setSoldProducts(productsSold);
    }

    const getTotalSold = ()=> {
        let total = 0;
        for(let i=0; i<soldProducts.length; i++){
            total += soldProducts[i].price;
        }
        setTotalSold(total);
    }
    

    const getCarts = async()=> {
        let result = await fetch(`https://uuu-3fwk.onrender.com/cart/${userId}`, {
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
            });
        result = await result.json();
        setCarts(result);
        let articles = 0;
        let total = 0;
        for(let i=0; i<result.length;i++){
            articles += result[i].cart.length;
            total += result[i].total;
        }
        setTotalArticles(articles);
        setTotal(total);
        }

        const deleteProduct= async(id)=>{
            let result = await fetch(`https://uuu-3fwk.onrender.com/${id}`, {
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
