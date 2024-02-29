import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
	name: String,
	admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Shop", shopSchema);
