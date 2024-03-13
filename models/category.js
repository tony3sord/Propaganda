import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	name: String,
});

export default mongoose.model("Category", CategorySchema);
