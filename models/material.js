import mongoose from "mongoose";
import Product from "./products.js";

const MaterialSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  name: String,
});

MaterialSchema.pre("findOneAndDelete", async function (next) {
  try {
    const material = await this.model.findOne(this.getQuery());
    console.log(material);
    const a = await Product.deleteMany({ shop: material.shop });
    console.log(a);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const Material = mongoose.model("Material", MaterialSchema);

export default Material;
