import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	about: String,
});

export default mongoose.model("About", aboutSchema);
