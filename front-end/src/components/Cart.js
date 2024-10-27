import React, { useEffect, useState } from 'react';
  
const Cart=()=> {
    
    const [cart, setCart]= useState([JSON.parse(localStorage.getItem("cart"))]);
    const [total, setTotal]= useState(0);
    const [products, setProducts] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    //const [total, setTotal]= useState("");

    useEffect(()=> { /*Permet d'activer la function à chaque clic sur le boutton*/ 
        getCart();
        
    }, [])
    
    useEffect(()=> { 
        getTotal();
    }, [])

    const getCart =  ()=> {
    setCart(JSON.parse(localStorage.getItem("cart")));
    }

    const validatePurchase = async()=>{  
        let result = await fetch("http://localhost:5000/cart", {
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
    }

    const getTotal = ()=> {
        let totalounet = 0;
        setProducts([]);
        for(let i=0; i<cart[0].length;i++){ // ??? cart[] ???
           setProducts(products.push(cart[0][i].price)) ;
        }
        if(products.length > 0){
            totalounet = products.reduce((accumulator, currentValue) => accumulator + currentValue, totalounet);
        }
        //Ça et en-dessous : Solution pour avoir le total du panier => MAJ lors de la suppression ?
       setTotal(totalounet);
       setProducts(products.length=0); // Sinon ça compte le panier en double
       totalounet = 0;
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
    
        let result = await fetch("http://localhost:5000/add-product",{ 
            method:"post",
            body:JSON.stringify({name, price, condition, userId, img}),
            headers: {
                "Content-Type":"application/json",
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        console.log("coucou");
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
            <button className="command" onClick={validatePurchase}>Commander</button>
            </div>
    </div>
    </div>
    )
}

export default Cart;
