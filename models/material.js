import mongoose from "mongoose";
import Shop from "./shop.js";

const MaterialSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
	name: String,
});

export default mongoose.model("Material", MaterialSchema);
