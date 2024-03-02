import mongoose from "mongoose";
import Shop from "./shop.js";
const PromotionSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
	images: [String],
});

export default mongoose.model("Promotion", PromotionSchema);
