import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	images: [String],
});

export default mongoose.model("Promotion", PromotionSchema);
