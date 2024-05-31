import mongoose from "mongoose";
import Product from "./products.js";
import Category from "./category.js";
import Material from "./material.js";
import User from "./users.js";
import Information from "./information.js";

const shopSchema = new mongoose.Schema({
  name: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  province: String,
  direction: String,
});

shopSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Product.deleteMany({ shop: this._id });
      await Material.deleteMany({ shop: this._id });
      await Category.deleteMany({ shop: this._id });
      await User.findOneAndDelete(this.admin);
      await Information.findOneAndDelete({ shop: this._id });
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
