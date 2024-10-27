import React, { useEffect, useState } from 'react';

import Product from '../Product';
import Quality from '../Quality';

// Use state to render difference in style
// !!! Using a select would be better for number of prod per page, why doesn't it work ? !!!

// Faire fonction séparée pour le style

const ProductList=()=>{

    const [products, setProducts]= useState([]); 
    const [allProducts, setAllProducts] = useState([]);

    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState(''); // '' Pour éviter l'avertissement max < min

    const [search, setSearch] = useState("");

    const [perfect, setPerfect] = useState(false);
    const [good, setGood] = useState(false);
    const [correct, setCorrect] = useState(false);
    const [bad, setBad] = useState(false);

   // const [productsStart, setProductsStart] = useState(0);
   // const [productsPerPage, setProductsPerPage] = useState(10);
   // const [productsEnd, setProductsEnd] = useState(10);

    let user = JSON.parse(localStorage.getItem("user"));

    const path = 'front-end/public/images/';

    useEffect(()=> {
        getProducts();
    }, [])


// If no clever state management system to prevent using the whole array allproducts every time, fusion hooks/functions bellow
    useEffect(()=> {
        getPerQuality();
        }, [bad, good, correct, perfect]
    );

    useEffect(()=> {
        getPerPrices();
        }, [priceMin, priceMax]
    );
    useEffect(()=> {
        getPerSearch();
        }, [search]
    );


    function ButtonQChgStyle (e) { // Nom à changer
        const ident = e.target.id; 
        const button = document.getElementById(ident);
        button.classList.toggle("selected");
    }
    
    const getProducts = async () => {
        let result = await fetch('https://uuu-3fwk.onrender.com/products', {
            headers:{
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}` // Only Change  
                //Viewable in Network -> products in Name column far down-left -> 
            }
        });
        result = await result.json();
  // Pour faire en sorte que l'utilisateur ne puisse pas voir ses propres produits
        let interM = [];
        for(let i=0; i<result.length;i++){
            if(result[i].userId !== user._id){
                interM.push(result[i]);
            }
        }
        setProducts(interM);
        setAllProducts(interM);    
    }



const getPerQuality = async() => {

    let inter = allProducts;
    let interFinal = [];

    if(priceMin > 0 || priceMax > 0) {
        inter = priceCheck(inter);
    } 

    if(search.length > 0) {
        inter = searchCheck(inter);
    } 

    if(perfect || good || correct || bad) {
        interFinal = qualityCheck(interFinal, inter);
    } else {
        interFinal = inter;
    }

    setProducts(interFinal);
}

    const getPerPrices = async() => {
        
        let inter = allProducts;
        let interFinal = [];

        if(perfect || good || correct || bad) {
            interFinal = qualityCheck(interFinal, inter);
        } else {
            interFinal = inter;
        }

        if(search.length > 0){
           interFinal = searchCheck(interFinal);
        } 
        
        interFinal = priceCheck(interFinal);
        setProducts(interFinal);
    }
        
    const getPerSearch = async() => {

        let inter = allProducts;
        let interFinal = [];

        if(priceMax > 0||priceMin >0) {
            inter = priceCheck(inter);
        }
        
        if(perfect || good || correct || bad) {
            interFinal = qualityCheck(interFinal, inter);
        } else {
            interFinal = inter;
        }

        if(search){
            interFinal = searchCheck(interFinal);
        } 

        setProducts(interFinal);
    }


/*
    const handlePaginationLess = async()=> {
            setProductsStart(productsStart - productsPerPage);
            setProductsEnd(productsEnd - productsPerPage);
    }
    const handlePaginationPlus = async()=> {
            setProductsStart(productsStart + productsPerPage);
            setProductsEnd(productsEnd + productsPerPage);
    }
    */

    const qualityCheck = (interFinal, inter) => { // L'async n'était pas nécessaire
        if (perfect) {
            interFinal = interFinal.concat(inter.filter((i)=> { return i.condition === "Perfect"}))
        }
        if (good) {
            interFinal = interFinal.concat(inter.filter((i)=> {return i.condition === "Good"}))
        }
        if (correct) {
            interFinal = interFinal.concat(inter.filter((i)=> {return i.condition === "Correct"}))
        }
        if (bad) {
            interFinal = interFinal.concat(inter.filter((i)=> {return i.condition === "Bad"}))
        }
        return interFinal;
}

const priceCheck = (array) => {
    if(priceMax >0 && priceMin >0 && priceMax > priceMin) {
        array = array.filter((i)=> i.price >= priceMin && i.price <= priceMax)
    } else if (priceMin > 0 ) {
        array = array.filter((i)=> i.price >= priceMin)
    } else if (priceMax > 0){ 
        array = array.filter((i)=> i.price <= priceMax)
    }
    return array;
}

const searchCheck = (array) => {
    const regex = new RegExp(`${search}`);
    array = array.filter((i)=> regex.test((i.name).toLowerCase()));
    return array;
}

    const searchHandle = async(event)=>{
        let key = event.target.value;
        setSearch(key);   
    } 

    const getMinPrice = async(event) => {
        if(Number(event.target.value) > 0) {
            let key = Number(event.target.value);
            setPriceMin(key);
        } else {
            setPriceMin('');
        }
    }
    const getMaxPrice = async(event) => {
        if(Number(event.target.value) > 0) {
            let key = Number(event.target.value);
            setPriceMax(key);
        } else {
            setPriceMax('');
        }
    }

    const getQuality = async(e) => {
        const ident = e.target.id;
        switch (ident) {
            case 'perfect':
                setPerfect(previous => !previous);
                break;
            case 'good':
                setGood(previous => !previous);
                break;
            case 'correct':
                setCorrect(previous => !previous);
                break;
            case 'bad':
                setBad(previous => !previous);
                break;
        }
    }

    return (
        <div className="product-list">

            <h1>Liste des produits</h1>
            <input type="text" className="search-product-box" placeholder="Recherchez votre produit !" onChange={(event)=> { searchHandle(event)}}/>
            <input type="number" className="search-product-box" onChange={(event)=> {
                getMinPrice(event);
                }}  placeholder="Minimum : ... €"/>
            <input type="number" className="search-product-box" onChange={(event)=> {
                getMaxPrice(event);
                }}  placeholder="Maximum ... €"/>
{priceMax < priceMin && typeof priceMax === 'number'&& <span className='invalid-input-register'>Le prix maximal est inférieur au minimum, seulement le minimum est pris en compte !</span>}
  
            <Quality text = "Choisissez la ou les conditions acceptables pour votre achat :"getQuality={getQuality} ButtonQChgStyle={ButtonQChgStyle}></Quality>
            <div className="products">
            {
               products.length>0 ? products.map((item, index)=> 
               <>
                <Product item={item} index={index}></Product>
                </>
                ) : <h1>Pas de résultat ...</h1>
            }
            </div>
        </div>
    )
}

export default ProductList;
