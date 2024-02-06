import mongoose from "mongoose";
import category from "./category.js";

const ProductsSchema = new mongoose.Schema({
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
});

export default mongoose.model("Products", ProductsSchema);
