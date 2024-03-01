import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
	about: String,
});

export default mongoose.model("About", aboutSchema);
