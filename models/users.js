import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: String,
  password: String,
  role: {
    type: String,
    enum: ["Cliente", "Admin", "Superadmin"],
  },
});

//For Register a User
UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
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
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("User", UserSchema);
