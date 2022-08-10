const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type: String ,
    },
    price: {
        type: Number ,
    },
    category: {
        type: String ,
    },
    storeId: {
        type: String , 
    },
    isSold: {
        type: Boolean ,
        default: false ,
    },
    isDelisted: {
        type: Boolean ,
        default: false ,
    },
    soldDate: {
        type: Date ,
    },
    buyer: {
        type: String ,
    }
},{ timestamps: true })

const Product = new mongoose.model("Product" , ProductSchema) ;

module.exports = Product ;