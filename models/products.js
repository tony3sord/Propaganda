import mongoose from "mongoose";
import Category from "./category.js";
import Shop from "./shop.js";
import Material from "./material.js";

const ProductsSchema = new mongoose.Schema(
	{
		shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
		name: String,
		price: Number,
		images: [String],
		description: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Category,
		},
		material: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Material,
		},
		amount: Number,
		sales: Number,
	},
	{ timestamps: true },
);

export default mongoose.model("Products", ProductsSchema);
