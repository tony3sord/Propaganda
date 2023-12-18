import mongoose from 'mongoose';
import product from './products.js';

const BasketSchema = new mongoose.Schema({
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
})

export default mongoose.model("Basket", BasketSchema);
