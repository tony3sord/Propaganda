import mongoose from "mongoose";
import Product from "./products.js";

const MaterialSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  name: String,
});

MaterialSchema.pre("findOneAndDelete", async function (next) {
  try {
    const material = await this.model.findOne(this.getQuery());
    await Product.deleteMany({ shop: material.shop });
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const Material = mongoose.model("Material", MaterialSchema);

export default Material;
