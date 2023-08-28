const mongoose = require('mongoose');
const productsSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    id:{
        type: Number,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    points:{
        type:Number,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    image: {
        type: String, // Store the file path
    }
});
const Products= mongoose.model('products',productsSchema)
module.exports = Products
