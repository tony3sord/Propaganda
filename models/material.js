import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
	name: String,
});

export default mongoose.model("Material", MaterialSchema);
