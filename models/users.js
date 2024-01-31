import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	user: String,
	password: String,
	role: String,
});

//For Register a User
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (error) {
		return next(error);
	}
});

//For change Password
UserSchema.methods.changePassword = async function (newPassword) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		this.password = hashedPassword;
		await this.save();
		return true;
	} catch (error) {
		throw error;
	}
};

export default mongoose.model("User", UserSchema);
