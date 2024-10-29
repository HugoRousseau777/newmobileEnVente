import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../Button';

const UpdateProduct =  ()=>{

    const [name, setName] = useState(''); 
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [loading, setLoading] = useState(false);


    const params = useParams();
    const navigate = useNavigate();

    useEffect(()=> {
        getProductDetails();
    }, []);

    const getProductDetails = async ()=>{
        let result = await fetch(`https://uuu-3fwk.onrender.com/product/${params.id}`, {
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result =await result.json();
        setName(result.name);
        setPrice(result.price);
        setCondition(result.condition);
    }


    const updateProduct = async ()=>{
        setLoading(true);
        let result = await fetch(`https://uuu-3fwk.onrender.com/product/${params.id}`, {
            method:'Put',
            body:JSON.stringify({name,price,condition}),
            headers: {
                'Content-Type':'Application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setLoading(false);
        navigate('/');
    }

    return (
        <div className="modifyProduct">
            <h1>Modification</h1>
            <input className='modProdInput' type="text" placeholder="Entrez le nom" value={name} onChange={(e)=>{setName(e.target.value)}}/>
            <input className='modProdInput' type="text" placeholder="Entrez le prix" value={price} onChange={(e)=>{setPrice(e.target.value)}}/>
            <select id="selectUpdate" className="modProdInput" onChange={(e)=>{setCondition(e.target.value)}}>
                <option defaultValue="">{condition}</option>
                <option defaultValue="bad">Bad</option>
                <option defaultValue="correct">Correct</option>
                <option defaultValue="good">Good</option>
                <option defaultValue="perfect">Perfect</option>
            </select>
            <Button loading={loading} function={updateProduct} text="Mettre à jour"/>
        </div>
    )
}

export default UpdateProduct;