import mongoose from "mongoose";
import Product from "./products.js";

const CategorySchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  name: String,
});

CategorySchema.pre("findOneAndDelete", async function (next) {
  try {
    const category = await this.model.findOne(this.getQuery());
    console.log(category);
    const a = await Product.deleteMany({ shop: category.shop });
    console.log(a);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
