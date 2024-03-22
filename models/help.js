import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	help: String,
});

export default mongoose.model("Help", helpSchema);
