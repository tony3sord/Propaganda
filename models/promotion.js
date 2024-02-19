import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
	images: [String],
});

module.exports = mongoose.model("Promotion", PromotionSchema);
