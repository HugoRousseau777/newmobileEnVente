import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct =  ()=>{

    const [name, setName] = React.useState(''); // No need to import !
    const [price, setPrice] = React.useState('');
    const [condition, setCondition] = React.useState('');
    const [company, setCompany] = React.useState('');


    // http://localhost:5000/register
// https://final-7wfu.onrender.com

    const params = useParams();
    const navigate = useNavigate();
    useEffect(()=> {
        getProductDetails();
    }, []);
    const getProductDetails = async ()=>{
        let result = await fetch(`https://final-7wfu.onrender.com/product/${params.id}`, {
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result =await result.json();
        setName(result.name);
        setPrice(result.price);
        setCondition(result.condition);
        setCompany(result.company);
    }


    const updateProduct = async ()=>{
        let result = await fetch(`https://final-7wfu.onrender.com/product/${params.id}`, {
            method:'Put',
            body:JSON.stringify({name,price,condition,company}),
            headers: {
                'Content-Type':'Application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        navigate('/');
    }

    return (
        <div className="product">
            <h1>Modification</h1>
            <input type="text" placeholder="Entrez le nom" value={name} onChange={(e)=>{setName(e.target.value)}}/>
            <input type="text" placeholder="Entrez le prix" value={price} onChange={(e)=>{setPrice(e.target.value)}}/>
            <input type="text" placeholder="Entrez l'état du téléphone" value={condition} onChange={(e)=>{setCondition(e.target.value)}}/>
            <input type="text" placeholder="Entrez le vendeur du téléphone (avant vous)" value={company} onChange={(e)=>{setCompany(e.target.value)}}/>
            <button onClick={updateProduct}>Mettre à jour</button>
        </div>
    )
}

export default UpdateProduct;