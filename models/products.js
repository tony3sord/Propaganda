import mongoose from "mongoose";
import category from "./category.js";
import Shop from "./shop.js";
const ProductsSchema = new mongoose.Schema(
	{
		shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
		name: String,
		price: Number,
		images: [String],
		description: String,
		category: {
			type: mongoose.Schema.Types.Mixed,
			ref: category,
		},
		amount: Number,
		sales: Number,
	},
	{ timestamps: true },
);

export default mongoose.model("Products", ProductsSchema);
