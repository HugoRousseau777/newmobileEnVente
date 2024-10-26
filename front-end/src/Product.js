import React, { useState } from 'react';


function Product(props) {

    let cart = JSON.parse(localStorage.getItem("cart"));
    
    const [prodDom, setProdDom]= useState(""); 


   

    const getTheId= async(e) => {        
        let product = document.getElementById(e.target.parentNode.parentNode.id);
        deleteProduct(e.target.parentNode.parentNode.id);
        addToCart(e.target.parentNode.parentNode.id);
        product.remove();
        //setProdDom(e.target.parentNode.parentNode.id);
        //console.log(e.target.parentNode.parentNode.id);
    }




    const deleteProduct= async(id)=>{
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method:"Delete",
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        //result = await result.json();
        result = await result.json();

        
        if(result){
          //  getProducts(); // Retirer le produit de la liste serait mieux

            
        } else {
            alert("Nothing happened !")
        }   
    }

    const addToCart= async(id)=> {
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        cart.push(result);
        localStorage.setItem("cart",JSON.stringify(cart));
        alert("Product added to cart !");
    }




    return (
        <div className="product" id={props.item._id}>
<div className="product-img">
    <img className="img-aleat" src={`/images/${props.item.img}`}/>
</div>
 <ul key={props.item._id} >
 <li>{props.item.name}</li>
 <li>{props.item.price} €</li>
 <li>{props.item.condition}</li>
 <li>{props.item.company}</li>
 </ul>
 <div className="product-buttons">
<button className="super-button" onClick={(e)=>{
    getTheId(e);
}}>Acheter</button>
</div>
</div>
    );
}



export default Product;