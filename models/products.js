import mongoose from 'mongoose';
import category from './category.js';

const ProductsSchema= new mongoose.Schema({
    name:String,
    price:String,
    images: [{url: String}],
    description:String,
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:category,
    },
    amount:Number,
});

export default mongoose.model("Products", ProductsSchema);