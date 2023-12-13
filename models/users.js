import mongoose from 'mongoose';
const UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    user:String,
    password:String,
});
export default mongoose.model("User", UserSchema);
