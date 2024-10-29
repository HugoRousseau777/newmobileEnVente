import React, { useEffect, useState } from 'react';

import Button from './Button';

function Product(props) {

    const [prodId, setProdId] = useState('');
    const [loading, setLoading] = useState(false);


useEffect(()=> {
    setLoading(true);
    if(prodId.length > 0) { // JS a un typage nul
        addToCart(prodId);
        deleteProduct(prodId);
        let product = document.getElementById(prodId);
        product.remove();
    }
    setLoading(false);

}, [prodId])
  
    const getTheId= async(e) => {      
        const productId = e.target.parentNode.parentNode.id;
        setProdId(productId);
       
    }

    const deleteProduct= async(id)=>{
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method:"Delete",
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });

        result = await result.json();


        if(!result){
            alert("Produit absent de la BDD");  
        } 
    }

    const addToCart= async(id)=> {
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        const cartou = [
            ...JSON.parse(localStorage.getItem("cart")),
            result
        ];
        localStorage.setItem('cart', JSON.stringify(cartou));
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
 <Button loading={loading} function={getTheId} text="Acheter"/>
</div>
</div>
    );
}



export default Product;