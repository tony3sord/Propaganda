import mongoose from "mongoose";
import Basket from "./basket.js";
const BuysSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	basket: {
		type: mongoose.Schema.Types.Mixed,
		ref: Basket,
	},

	street: String,
	number: Number,
	city: String,
	country: String,
	delivered: Boolean,
});

export default mongoose.model("Buys", BuysSchema);
