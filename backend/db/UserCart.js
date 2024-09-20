const mongoose = require('mongoose');

const userCartSchema = new mongoose.Schema({
    cart: Array,
    userId: String,
    total: Number
}, {
    timestamps:true
});

module.exports = mongoose.model("userCarts",userCartSchema);