import mongoose from "mongoose";
import Shop from "./shop.js";

const contactSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: Shop },
	gmail: String,
	phone: String,
	direction: String,
});

export default mongoose.model("Contact", contactSchema);
