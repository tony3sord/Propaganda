import express from "express";
const router = express.Router();
import Promotion from "../models/promotion.js";

router.get("/promotion/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const promotion = await Promotion.findOne({ shop });
		res.status(200).json(promotion);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addpromotion/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { promotion } = req.body;
	try {
		const newPromotion = new Promotion({
			shop,
			promotion,
		});
		await newPromotion.save();
		res.status(200).send("Promotion added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error server");
	}
});

router.patch("/editpromotion/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { promotion } = req.body;
	try {
		await Promotion.findOneAndUpdate({ shop }, { promotion });
		res.status(200).send("Promotion edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error server");
	}
});

router.delete("/deletepromotion/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		await Promotion.findOneAndDelete({ shop });
		res.status(200).send("Promotion deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});
