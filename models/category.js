import mongoose from "mongoose";
import Shop from "./shop.js";

const CategorySchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
	name: String,
});

export default mongoose.model("Category", CategorySchema);
