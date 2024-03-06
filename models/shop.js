import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
	name: String,
	admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	province: String,
	direction: String,
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
