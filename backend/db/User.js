const mongoose = require('mongoose');
let currentDate = new Date();

/*Modif : Timestamps pour */

const userSchema = new mongoose.Schema({
    name: String, 
    email:String,
    password:String
},
{timestamps: true});

module.exports = mongoose.model("users", userSchema); // "users" should match with the collection "users" in compass