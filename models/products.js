import mongoose from 'mongoose';

const ProductsSchema= new mongoose.Schema({
    name:String,
    price:String,
    images: [{url: String}],
    description:String,
    //The category is a String because it is a select in the view, but The client must specify what they are  
    category:String,
});

export default mongoose.model("Products", ProductsSchema);