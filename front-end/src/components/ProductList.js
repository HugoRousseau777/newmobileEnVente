import React, { useEffect, useState } from 'react';

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

    const [productsStart, setProductsStart] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [productsEnd, setProductsEnd] = useState(10);

    const conditionButtons = Array.from(document.getElementsByClassName("conditionButton"));
    let cart = JSON.parse(localStorage.getItem("cart"));
    let user = JSON.parse(localStorage.getItem("user"));

    const path = 'front-end/public/images/';

    useEffect(()=> {
        getProducts();
    }, [])

    useEffect(()=> {
        getQuality();
        }, [bad, good, correct, perfect]
    );

    useEffect(()=> {
        getPrices();
        }, [priceMin, priceMax]
    );
    useEffect(()=> {
        getSearch();
        }, [search]
    );

    // a) A changer, directement via la BDD plutôt que par aléatoire 

    const imgs = ['aa.jpeg','dza.jpeg','téléchargement.jpeg'];
    let allRandom = []; // Array des n° d'images aléatoire ; Lgth= au nombre d'article
    for (let i =0; i<products.length; i++){
    let rand = Math.floor(Math.random()*imgs.length);
    allRandom.push(rand);
    }

    // a)

    function aaa (e) { // Nom à changer
        const ident = e.target.id; // To get id of clicked element
        const button = document.getElementById(ident);
        conditionButtons.forEach(button=> {
            if(button.id !== ident) // That way the toggle works correctly
            button.classList.remove("selected");
        })
        button.classList.toggle("selected");
    }
    
    const getProducts = async () => {
        let result = await fetch('http://localhost:5000/products', {
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

    const deleteProduct= async(id)=>{
        console.warn(id);
        let result = await fetch(`http://localhost:5000/product/${id}`, {
            method:"Delete",
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        if(result){
            getProducts();
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

const getQuality = async() => {

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

    const getPrices = async() => {
        
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
        
    const getSearch = async() => {

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

    const getMoreThan = async(event) => {
        if(Number(event.target.value) > 0) {
            let key = Number(event.target.value);
            setPriceMin(key);
        } else {
            setPriceMin('');
        }
    }
    const getLessThan = async(event) => {
        if(Number(event.target.value) > 0) {
            let key = Number(event.target.value);
            setPriceMax(key);
        } else {
            setPriceMax('');
        }
    }
    const searchHandle = async(event)=>{
        let key = event.target.value;
        setSearch(key);   
    } 

    const getQualityState = async(e) => {
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
                getMoreThan(event);
                }}  placeholder="Minimum : ... €"/>
            <input type="number" className="search-product-box" onChange={(event)=> {
                getLessThan(event);
                }}  placeholder="Maximum ... €"/>

{priceMax < priceMin && typeof priceMax === 'number'&& <span className='invalid-input-register'>Le prix maximal est inférieur au minimum, seulement le minimum est pris en compte !</span>}
                <br>
                </br>
            <p>Choisissez une condition acceptable pour votre achat, vous aurez cet état et mieux :</p>
            <div className="condition containerCondBut">
            <button className="conditionButton" id="perfect" onClick={(e)=> {
                    getQualityState(e);
                    aaa(e);
                    }}>Parfait</button> 
                <button className="conditionButton" id="good" onClick={(e)=>{
                     getQualityState(e);
                     aaa(e)
                    }}>Bon</button> 
                <button className="conditionButton" id="correct" onClick={(e)=>{
                    getQualityState(e);
                    aaa(e);}}>Correct</button> 
                <button className="conditionButton" id="bad" onClick={(e)=>{
                    getQualityState(e);
                    aaa(e);}}>Mauvais</button> 
            </div>
            <div className="products">
            {
               products.length>0 ? (products.slice(productsStart, productsEnd + 1)).map((item, index)=> 
               <>
               <div className="product">
                   <div className="product-img">
                       <img className="img-aleat" src={`/images/${imgs[allRandom[index]]}`}/>
                   </div>
                    <ul key={item._id} >
                    <li>{item.name}</li>
                    <li>{item.price} €</li>
                    <li>{item.condition}</li>
                    <li>{item.company}</li>
                    </ul>
                    <div className="product-buttons">
                        <button className="super-button" onClick={()=>{addToCart(item._id);
                                                                        deleteProduct(item._id);
                        }}>Acheter</button>
                    </div>
                </div>
                </>
                ) : <h1>Pas de résultat ...</h1>
            }
            </div>

        </div>
    )
}

export default ProductList;
