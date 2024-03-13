import mongoose from "mongoose";
import Opinion from "./opnion.js";

const ProductsSchema = new mongoose.Schema(
	{
		shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
		name: String,
		price: Number,
		images: [String],
		description: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		material: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Material",
		},
		amount: Number,
		sales: Number,
	},
	{ timestamps: true },
);

ProductsSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		try {
			await Opinion.deleteMany({ shop: this._id });
			next();
		} catch (error) {
			console.log(error);
			next(error);
		}
	},
);

export default mongoose.model("Products", ProductsSchema);
