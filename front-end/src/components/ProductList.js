import React, { useEffect, useState } from 'react';

// Use state to render difference in style
// !!! Using a select would be better for number of prod per page, why doesn't it work ? !!!

const ProductList=()=>{

    const [productsStart, setProductsStart] = useState(0);
    const [productsPerPage, setProductsPerPage] = useState(10);
    const [productsEnd, setProductsEnd] = useState(10);
    const [products, setProducts]= useState([]); 
    const [allProducts, setAllProducts] = useState([]);
    const [priceMore, setPriceMore] = useState(0);
    const [priceLess, setPriceLess] = useState(0);
    const [priceInterval, setPriceInterval] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searchQuality, setSearchQuality] = useState([]);
    const [perfect, setPerfect] = useState(false);
    const [good, setGood] = useState(false);
    const [ok, setOk] = useState(false);
    const [bad, setBad] = useState(false);

    const conditionButtons = Array.from(document.getElementsByClassName("conditionButton"));
    let cart = JSON.parse(localStorage.getItem("cart"));
    let user = JSON.parse(localStorage.getItem("user"));

    const path = 'front-end/public/images/';
    const imgs = ['aa.jpeg','dza.jpeg','téléchargement.jpeg'];
    let allRandom = []; // Array des n° d'images aléatoire ; Lgth= au nombre d'article
    for (let i =0; i<products.length; i++){
    let rand = Math.floor(Math.random()*imgs.length);
    allRandom.push(rand);
    }

    function aaa (e) {
        const ident = e.target.id; // To get id of clicked element
        const button = document.getElementById(ident);
        conditionButtons.forEach(button=> {
            if(button.id !== ident) // That way the toggle works correctly
            button.classList.remove("selected");
        })
        button.classList.toggle("selected");
    }
    
    useEffect(()=> {
        getProducts();
    }, [])
    useEffect(()=> {
        console.log(products.length);
    }, [products])

    const getProducts = async () => {
        let result = await fetch('https://final-7wfu.onrender.com/products', {
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

const getQuality = async(e) => {
    const regex = new RegExp(`${search}`);
    let inter = allProducts; 

    const ident = e.target.id;
    switch (ident) {
    case 'perfect':
        if(!perfect){
            inter = inter.filter((i)=> i.condition === "Perfect");
        } else {
            inter = allProducts;
        }
        setPerfect(!perfect);
        setGood(false);
        setOk(false);
        setBad(false);
        break;
    case 'good':
        if(!good){
            inter = inter.filter((i)=> i.condition == "Perfect").concat(inter.filter((i)=> i.condition == "Good"));
        } else {
            inter = allProducts;
        }
        setPerfect(false);
        setGood(!good);
        setOk(false);
        setBad(false);
        break;
    case 'correct':
        if(!ok){
            inter = inter.filter((i)=> i.condition !== "Bad");
        } else {
            inter = allProducts;
        } 
        setPerfect(false);
        setGood(false);
        setOk(!ok);
        setBad(false);
        break;
    default:
        inter = allProducts;
        setPerfect(false);
        setGood(false);
        setOk(false);
        setBad(!bad);
    }
    setSearchQuality(inter);
    if (priceMore) {
        inter = inter.filter((i)=> i.price > priceMore)
    }
    if (priceLess) {
        inter = inter.filter((i)=> i.price < priceLess)
    }
    if(search){
        inter = inter.filter((i)=> regex.test(i.name));
    } 
    setProducts(inter);
}

    const getMoreThan = async(event) => {
        let key = event.target.value;
        setPriceMore(key);
    }

    const getLessThan = async(event) => {
        let key = event.target.value;
        setPriceLess(key);
    }

    useEffect(()=> {
        const regex = new RegExp(`${search}`); 
        let inter = allProducts; 
        if(perfect || good || ok) {
            inter = searchQuality;
        }

        if(priceLess){
            inter = inter.filter((i)=> i.price < priceLess);
            if(priceMore){
                inter = inter.filter((i)=> i.price > priceMore);
            } 
        } else if (priceMore) {
            inter = inter.filter((i)=> i.price > priceMore);
        } 
        setProducts(inter);
        setPriceInterval(inter); // PB Because quality is in it too

        if(search){
            inter = inter.filter((i)=> regex.test(i.name))
            setProducts(inter);
        }
 
    }, [priceLess, priceMore])

    const searchHandle = async(event)=>{
        let key = event.target.value;
        setSearch(key);   
    } 

    useEffect(()=> {
        let inter = allProducts;
        // !!! We can put if/else to determine the original array to work with !!!
        if(perfect || good || ok) {
            inter = searchQuality;
            if (priceMore) {
                inter = inter.filter((i)=> i.price > priceMore)
            }
            if (priceLess) {
                inter = inter.filter((i)=> i.price < priceLess)
            }
        } else if(priceInterval.length > 0) {
            inter = priceInterval;
        } else {
            inter = allProducts;
        }
        
        if(search) {
            const regex = new RegExp(`${search}`);
            let searchResult = inter.filter((i)=> regex.test(i.name));
            setProducts(searchResult);
        } else {
            setProducts(inter);

        }
        setSearchResult(searchResult);
    }, [search])
   
    const deleteProduct= async(id)=>{
        console.warn(id);
        let result = await fetch(`https://final-7wfu.onrender.com/product/${id}`, {
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
        let result = await fetch(`https://final-7wfu.onrender.com/product/${id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        cart.push(result);
        localStorage.setItem("cart",JSON.stringify(cart));
        alert("Product added to cart !");
    }

    const handlePaginationLess = async()=> {
            setProductsStart(productsStart - productsPerPage);
            setProductsEnd(productsEnd - productsPerPage);
    }
    const handlePaginationPlus = async()=> {
            setProductsStart(productsStart + productsPerPage);
            setProductsEnd(productsEnd + productsPerPage);
    }
    
    return (
        <div className="product-list">
            <h1>Liste des produits</h1>
            <input type="text" className="search-product-box" placeholder="Recherchez votre produit !" onChange={(event)=> { searchHandle(event)}}/>
            <input type="number" className="search-product-box" onChange={(event)=> {
                getMoreThan(event);
                }}  placeholder="Plus de ... €"/>
            <input type="number" className="search-product-box" onChange={(event)=> {
                getLessThan(event);
                }}  placeholder="Moins de ... €"/>
            <p>Choisissez une condition acceptable pour votre achat, vous aurez cet état et mieux :</p>
            <div className="condition containerCondBut">
            <button className="conditionButton" id="perfect" onClick={(e)=> {
                    getQuality(e);
                    aaa(e);
                    }}>Parfait</button> 
                <button className="conditionButton" id="good" onClick={(e)=>{
                     getQuality(e);
                     aaa(e)
                    }}>Bon</button> 
                <button className="conditionButton" id="correct" onClick={(e)=>{
                    getQuality(e);
                    aaa(e);}}>Correct</button> 
                <button className="conditionButton" id="bad" onClick={(e)=>{
                    getQuality(e);
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
            <div>
                <button disabled={productsStart == 0} onClick={handlePaginationLess}>Previous</button>
                <button disabled={products.length + productsPerPage< productsEnd + productsPerPage} onClick={handlePaginationPlus}>Next</button>
                <button onClick={()=> {
                    setProductsStart(0);
                    setProductsEnd(5);
                    setProductsPerPage(5)
                }}>5 per page</button>
                <button onClick={()=> {
                    setProductsStart(0);
                    setProductsEnd(10);
                    setProductsPerPage(10)
                }}>10 per page</button>
                <button onClick={()=> {
                    setProductsStart(0);
                    setProductsEnd(15);
                    setProductsPerPage(15)
                }}>15 per page</button>
            </div>
        </div>
    )
}

export default ProductList;
