import React, { useEffect, useState } from 'react';
  
import Button from '../Button';

const Cart=()=> {
    
    const [cart, setCart]= useState([JSON.parse(localStorage.getItem("cart"))]);
    const [total, setTotal]= useState(0);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;

    useEffect(()=> { 
        getCart();
    }, [])

    useEffect(()=> { 
        getTotal();
    }, [])

    const getCart =  ()=> {
    setCart(JSON.parse(localStorage.getItem("cart")));
    }

    const validatePurchase = async()=>{  
        setLoading(true);
        let result = await fetch("https://uuu-3fwk.onrender.com/cart", {
            method:'post',
            body:JSON.stringify({cart, userId, total}),
            headers:{
                'Content-Type':'application/json'
            }
        });
        result = await result.json();
        setCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
        setTotal(0);
        setLoading(false);
    }

    const getTotal = ()=> {
        let totalounet = 0;
        setProducts([]);
        for(let i=0; i<cart[0].length;i++){ 
           setProducts(products.push(cart[0][i].price)) ;
        }
        if(products.length > 0){
            totalounet = products.reduce((accumulator, currentValue) => accumulator + currentValue, totalounet);
        }
       setTotal(totalounet);
       setProducts(products.length=0); // Sinon ça compte le panier en double
    }
       
    const deleteFromCart = (indexOfArticle)=> {
        setTotal(total - cart[indexOfArticle].price);
        cart.splice(indexOfArticle, 1);
        localStorage.setItem("cart",JSON.stringify(cart));
        getCart(); // Permet de retirer de la page sans avoir à recharger 
    };

    const addProductToListAfterDelete = async (item)=>{
        let userId = item.userId; 
        let name = item.name;
        let price = item.price;
        let condition = item.condition;
        let img = item.img;
    
        let result = await fetch("https://uuu-3fwk.onrender.com/add-product",{ 
            method:"post",
            body:JSON.stringify({name, price, condition, userId, img}),
            headers: {
                "Content-Type":"application/json",
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
    }

    return(<div>
        <div className="cart">
        <h1>Votre panier</h1>
            <div className="articles">
            {
                cart.map((item, index)=> 
                
                <ul className="article"key={index}> 
                    <li className="name">{item.name}</li>
                    <li>{item.price} €</li>
                    <li>{item.condition}</li>
                    <li>{item.company}</li>
                    <li>
                        <button onClick={(e)=>{
                            addProductToListAfterDelete(item);
                            deleteFromCart(index);
                        }}>Supprimer</button>
                    </li>
                </ul>
                )
            }
            <p className="totalCart">Total : {total} €</p>
            <Button loading={loading} function={validatePurchase} text="Commander"/>
            </div>
    </div>
    </div>
    )
}

export default Cart;
