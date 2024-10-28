import React, { useEffect } from 'react';
import Quality from '../Quality';

import Button from '../Button';
const AddProduct =  ()=> {

    const [name, setName] = React.useState(''); // No need to import !
    const [price, setPrice] = React.useState('');
    const [condition, setCondition] = React.useState('');
    const [error, setError] = React.useState(false);

    const iphoneImgs = ["13Minuit.webp", "13Pro.webp", "aa.jpeg", "dza.jpeg", "I3Bad.webp", "I155G.webp", "iphone3Gs.webp"
        , "iphone13.webp", "iphone15.webp", "iphoneOne.webp", "iphonerigolo.webp", "shopping.webp", "téléchargement.jpeg"];
    const samsungImgs = ["gala.webp", "galass.webp", "galaxy.webp", "galaxyA.webp", "jc.webp", "S21_5G.webp", "samsung.webp",
        "samsungGalaxyRigolo.webp", "SGS22Bad.webp", "SGS22Ultra.webp"
    ];

    function handleFormSubmit(event) {
        event.preventDefault();
    }

    let conditionButtons = document.getElementsByClassName("conditionButton");
    setTimeout(()=> {
        conditionButtons = Array.from(conditionButtons);
    }, "100")
    
    useEffect(() => {
        console.log(conditionButtons);
        
    }, [])

    function ButtonQChgStyle (e) {
        const ident = e.target.id; 
        const button = document.getElementById(ident);
        conditionButtons.forEach(button=> {
            if(button.id !== ident) 
            button.classList.remove("selected");
        })
        button.classList.toggle("selected");
    }

    const getQuality = async(e) => {
        const ident = e.target.id;
        setCondition(ident);
    }

    const addProduct = async ()=>{
        if(!name || !price || !condition){
            setError(true);
            return false;
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id; 
        let img = "";


        if(name.includes("iphone")) {
            let random = Math.floor(Math.random() * (iphoneImgs.length - 1))  ;
            img = iphoneImgs[random];
        }

        if(name.includes("samsung")) {
            let random = Math.floor(Math.random() * (samsungImgs.length - 1))  ;
            img = samsungImgs[random];
        }

        let result = await fetch("http://localhost:5000/add-product",{ 
            method:"post",
            body:JSON.stringify({name, price, condition, userId, img}),
            headers: {
                "Content-Type":"application/json",
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        alert("Product added !");
    }
 
    return (
        <form onSubmit={handleFormSubmit} className="add-product">
            <h1>Mettre en vente un téléphone</h1>
            <label for="name-select"></label>
            <select id="name-select" onChange={(e)=>{setName(e.target.value)}}>
                <option defaultValue="">Choisissez le mobile dans la liste</option>
                <option defaultValue="iphone 1">iphone 1</option>
                <option defaultValue="iphone 2">iphone 2</option>
                <option defaultValue="iphone 3">iphone 3</option>
                <option defaultValue="iphone 3">iphone 4</option>
                <option defaultValue="iphone 3">iphone 5</option>
                <option defaultValue="iphone 3">iphone 6</option>
                <option defaultValue="iphone 3">iphone 7</option>
                <option defaultValue="iphone 3">iphone 8</option>
                <option defaultValue="iphone 3">iphone 9</option>
                <option defaultValue="iphone 3">iphone 10</option>
                <option defaultValue="samsung 1">samsung 1</option>
                <option defaultValue="samsung 2">samsung 2</option>
                <option defaultValue="samsung 2">samsung 3</option>
                <option defaultValue="samsung 2">samsung galaxy</option>
                <option defaultValue="samsung 2">samsung S+</option>
                <option defaultValue="samsung 2">samsung 4</option>
                <option defaultValue="samsung 2">samsung 5</option>
                <option defaultValue="samsung 2">samsung 6</option>
            </select>
            {error && !name && <div className='invalid-input'>Entrez un nom !</div>}
            <label for="price"></label>
            <input id="price" type="number" step="50" placeholder="Enter le prix de vente" defaultValue={price} onChange={(e)=>{setPrice(e.target.value)}}
            />
            {error && !price && <div className='invalid-input'>Entrez un prix !</div>}
                <Quality container="addCondition" text="État de votre téléphone :" getQuality={getQuality} ButtonQChgStyle={ButtonQChgStyle}></Quality>
            {error && !condition && <div className='invalid-input'>Entrez l'état de votre téléphone !</div>}
           
            <Button function={addProduct} text="Mettre en vente"/>
        </form>
    )
}

export default AddProduct;
