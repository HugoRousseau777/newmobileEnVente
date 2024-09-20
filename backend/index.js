const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Products");
const UserCart = require("./db/UserCart");
const app = express();

//import {connect} from "./db/config"
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';

const uri = "mongodb+srv://hugo:megaman00@cluster0.7qqwlqk.mongodb.net/e-comm?retryWrites=true&w=majority"; // Attention à mettre le nom de la db apprès .net/
const mongoose = require('mongoose');

async function connect() {
  try {
   await mongoose.connect(uri);
  console.log("connected to mongodb");
  } catch (error) {
    console.log(error)
  }
}

connect();
app.use(express.json()); // Middleware
app.use(cors()); // Middleware
app.disable('etag');

/*Enregistrement et visualisation des paniers utilisateurs */

app.post("/cart", async (req,res)=> {
  let cart = new UserCart(req.body);
  let result = await cart.save();
  res.send(result);
})

app.get("/cart/:userId", async(req,res)=> {
  const carts = await UserCart.find({userId: req.params.userId});
      res.send(carts);
})
app.get("/carts", async(req,res)=> {
  const carts = await UserCart.find();
      res.send(carts);
})

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let doubleName = await User.findOne({name: req.body.name});
  let doubleEmail = await User.findOne({email: req.body.email});

  if(!doubleName && !doubleEmail) {
    if(req.body.password !== req.body.confirmPassword){
      res.send("Confirmez correctement votre mot de passe !")
    } else {
      // Si les MDP sont = && le nom et l'email ne sont pas pris : 
      emailVerif = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if(emailVerif.test(req.body.email)){
      let result = await user.save(); 
      Jwt.sign({result}, jwtKey, {expiresIn : "2h"}, (err, token) => {
        if (err) {
          res.send("Something went wrong");
        }
        res.send({result, auth: token});
      })} else {
        res.send({email: req.body.email});
      }
    }
  } else {
      if(doubleEmail && doubleName) {
        let newName = doubleName.name;
        let newEmail = doubleEmail.email;
        while(doubleName){
          newName = doubleName.name + "2";
          doubleName = await User.findOne({name: newName});
        }
        while(doubleEmail){
          newEmail = doubleEmail.email + "2";
          doubleEmail = await User.findOne({email: newEmail});
        }
        res.send({newName, newEmail});
      }
      else if(doubleName) {
        let newName = doubleName.name;
        while(doubleName){
          newName = doubleName + "2";
          doubleName = await User.findOne({name: newName});
        }
        res.send({newName});
      }
      else if(doubleEmail) {
        let newEmail = doubleEmail.email;
        while(doubleEmail){
          newEmail = newEmail + "2";
          doubleEmail = await User.findOne({email: newEmail});
        }
        res.send({newEmail});
      }
  }
    
  /*result = result.toObject(); // Allows to do line bellow
  delete result.password;*/
  /*Jwt Add*/
  
});

app.post("/login",  async (req, res) => {
      if (req.body.email && req.body.password){
        let user = await User.findOne(req.body) //.select("-password") Means the password isnt included in user // !! Attention à value qui n'existe pas dans cette logique !! Perdu 3J sur req.body.value !!!!!
        if (user) {
            Jwt.sign({user}, jwtKey, {expiresIn:"2h"}, (err, token) => {
              if (err) {
                res.status(200).send({result:"Something went wrong !"});
              }
              res.status(200).send({user, auth:token});
            })
          } else {
            res.status(200).send({ result: "No user found" });
          }
      } else {
          res.status(200).send("Email or password lacking");
      }
  });

app.post("/add-product", verifyToken, async (req, res)=>{
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});

app.get("/products", async (req,res)=>{
  const products = await Product.find();
  if(products.length>0){
      res.send(products);
    } else {
    res.send({result:"No products !"})
  }
})
// Ajout tri par prix !!! Fonctionne, plus qu'à pouvoir l'adapter au curseur
app.get("/productsbypriceMore/:key", async (req, res)=> {
  const products = await Product.find({price: {$gt:req.params.key}}).sort({"price": -1, "_id": 1}); // trie le prix par ordre décroissant (l'id est là pour avoir le même ordre à chaque fois qu'on a des prix identiques) 
  res.send(products);
  /* Empêchait la MAJ quand tous les produits de la page allaient être supprimés par la requête !!! 
  if(products.length>0){
    
  } else {
    res.send("Ohoh");
  }*/
})
app.get("/productsbypriceLess/:key", async (req, res)=> {
  const products = await Product.find({price: {$lt:req.params.key}}).sort({"price": 1, "_id": 1});
  res.send(products);
})


app.delete("/product/:id", verifyToken, async (req, res)=> {
  let result = await Product.deleteOne({_id: req.params.id});
  res.send(result);
})

app.put("/product/:id", verifyToken, async(req, res) => {
  let result = await Product.updateOne(
    {_id: req.params.id},
    {$set: req.body}
  )
  res.send(result);
})

app.get("/product/:id", verifyToken, async (req, res)=> {
  let result = await Product.findOne({_id:req.params.id})
  if(result){
    res.send(result);
  } else {
    res.send({"result": "No record found !"}); // Error: socket hang up instead !

  }
})

app.get("/search/:key", verifyToken, async (req, res)=> {
  let result = await Product.find({
    "$or": [
      {
        name: {$regex: req.params.key}
      },
      {
        category: {$regex: req.params.key}
      }
    ]
  });
  res.send(result);
});

function verifyToken(req,res,next){
  console.warn(req.headers['authorization']); // warn works in VS terminal
  let token = req.headers['authorization'];
  if(token){
    token = token.split(' ')[1];
    Jwt.verify(token, jwtKey, (err, valid)=> {
      if(err){
        res.status(401).send('Please provide a valid token');
      } else {
        next(); // Allows to get out of the middleware and execute rect of function it's called in

      }
    });
  } else {
    res.status(403).send('Please provide a token');
  }
}

app.listen(5000);
