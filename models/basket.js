import mongoose from "mongoose";
import product from "./products.js";
import user from "./users.js";

const BasketSchema = new mongoose.Schema({
	product: [
		{
			type: mongoose.Schema.Types.Mixed,
			ref: product,
		},
	],
	user: {
		type: mongoose.Schema.Types.Mixed,
		ref: user,
	},
});

export default mongoose.model("Basket", BasketSchema);
