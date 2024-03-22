import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
	shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
	service: String,
});

export default mongoose.model("Service", ServiceSchema);