import express from "express";
const router = express.Router();
import Basket from "../models/basket.js";
import Product from "../models/products.js";

//Send the basket like a JSON Object
router.get("/basket/:id", async (req, res) => {
	const basket = await Basket.find({ user: req.user._id });
	const total1 = await Basket.aggregate([
		{ $match: { user: req.user._id } },
		{ $group: { _id: null, total: { $sum: "$price" } } },
	]);
	const total = total1[0].total;
	res.status(200).json({ basket, total });
});

//Add a product to the basket
router.get("/addproductstobasket/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	await Basket.updateOne(
		{ user: req.user._id },
		{ $push: { product: product } },
	);
	const basket = await Basket.find({ user: req.user._id });
	res.status(200).json({ basket });
});

//Delete a product of the basket
router.delete("/removeproductstobasket/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	await Basket.updateOne(
		{ user: req.user._id },
		{ $pull: { product: product } },
	);
	const basket = await Basket.find({ user: req.params.id });
	res.status(200).json({ basket });
});

//Delete the basket
router.delete("/removebasket/:id", async (req, res) => {
	await Basket.findByIdAndDelete(req.params.id);
	res.status(200).send("Basket deleted");
});

export default router;
