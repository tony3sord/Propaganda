import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
	help: String,
});

export default mongoose.model("Help", helpSchema);
