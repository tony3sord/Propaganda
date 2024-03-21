import mongoose from "mongoose";
import Shop from "./shop.js";

const companySchema = new mongoose.Schema({
	name: "Empresa Nacional Propaganda y Eventos",
	shop: [{ type: mongoose.Schema.Types.ObjectId, ref: Shop }],
});

export default mongoose.model("Company", companySchema);
