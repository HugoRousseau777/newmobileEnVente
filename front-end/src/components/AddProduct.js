import React, { useEffect } from 'react';

import Button from '../Button';
const AddProduct =  ()=> {

    const [name, setName] = React.useState(''); // No need to import !
    const [price, setPrice] = React.useState('');
    const [condition, setCondition] = React.useState('');
    const [error, setError] = React.useState(false);

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

    function aaa (e) {
        const ident = e.target.id; // To get id of clicked element
        const button = document.getElementById(ident);
        conditionButtons.forEach(button=> {
            if(button.id !== ident) // That way the toggle works correctly
            button.classList.remove("selected");
        })
        button.classList.toggle("selected");
        setCondition(ident);
    }

    const addProduct = async ()=>{
        if(!name || !price || !condition){
            setError(true);
            return false;
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id; // localStorage.getItem('user')._id doesnt work
        console.warn(userId);
        let result = await fetch("http://localhost:5000/add-product",{ // Doit être l'adresse de la route
            method:"post",
            body:JSON.stringify({name, price, condition, userId}),
            headers: {
                "Content-Type":"application/json",
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        alert("Product added !");
    }
 
    // size in select allows to show number of items to show
    // <button onClick={()=>setCondition("a")} When using set... directly in onClick, dont forget ()=>set...
    return (
        <form onSubmit={handleFormSubmit} className="add-product">
            <h1>Mettre en vente un téléphone</h1>
            <label for="name-select"></label>
            <select id="name-select" onChange={(e)=>{setName(e.target.value)}}>
                <option defaultValue="">Choisissez le mobile dans la liste</option>
                <option defaultValue="iphone 1">iphone 1</option>
                <option defaultValue="iphone 2">iphone 2</option>
                <option defaultValue="iphone 3">iphone 3</option>
                <option defaultValue="samsung 1">Samsung 1</option>
                <option defaultValue="samsung 2">samsung 2</option>
            </select>
            {error && !name && <div className='invalid-input'>Entrez un nom !</div>}
            <label for="price"></label>
            <input id="price" type="number" step="50" placeholder="Enter le prix de vente" defaultValue={price} onChange={(e)=>{setPrice(e.target.value)}}
            />
            {error && !price && <div className='invalid-input'>Entrez un prix !</div>}
            <div className="condition">
                <p>État de votre téléphone :</p>
                <div className="containerCondBut">
                <button className="conditionButton" id="Perfect" onClick={(e)=> {
                    aaa(e);
                    }}>Parfait</button> 
                <button className="conditionButton" id="Good" onClick={(e)=>{aaa(e);
            }
            }>Bon</button> 
                <button className="conditionButton" id="Correct" onClick={(e)=>{aaa(e);
            }}>Correct</button> 
                <button className="conditionButton" id="Bad" onClick={(e)=>{aaa(e);
            }}>Mauvais</button> 
                </div>
            </div>
            {error && !condition && <div className='invalid-input'>Entrez l'état de votre téléphone !</div>}
           
            <Button function={addProduct} text="Mettre en vente"/>
        </form>
    )
}

export default AddProduct;
