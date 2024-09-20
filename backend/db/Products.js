const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    condition: String, // CG condition
    userId: String,
    company:String
}, {
    timestamps:true
});

module.exports = mongoose.model("products",productSchema);