import mongoose from "mongoose";
import Basket from "./basket.js";
import UEB from "./ueb.js";

const BuysSchema = new mongoose.Schema({
	basket: {
		type: mongoose.Schema.Types.Mixed,
		ref: Basket,
	},
	ueb: {
		type: mongoose.Schema.Types.Mixed,
		ref: UEB,
	},
	street: String,
	number: Number,
	city: String,
	country: String,
	delivered: Boolean,
});

export default mongoose.model("Buys", BuysSchema);
