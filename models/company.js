import mongoose from "mongoose";
import UEB from "./ueb.js";

const companySchema = new mongoose.Schema({
	name: "Empresa Nacional Propaganda y Eventos",
	ueb: [{ type: mongoose.Schema.Types.ObjectId, ref: UEB }],
});

export default mongoose.model("Company", companySchema);
