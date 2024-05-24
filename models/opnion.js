import mongoose from "mongoose";

const OpinionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  opinions: String,
  assessments: {
    type: Number,
    min: [0, "El valor mínimo es 0"],
    max: [5, "El valor máximo es 5"],
  },
});

export default mongoose.model("Opinion", OpinionSchema);
