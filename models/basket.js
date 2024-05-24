import mongoose from "mongoose";
import Product from "./products.js";
import user from "./users.js";

const BasketSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
      },
      quantity: Number,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Basket", BasketSchema);
