import express from "express";
const router = express.Router();
import About from "../models/about.js";

router.get("/about/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const about = await About.findOne({ shop });
		res.status(200).json(about);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addabout/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { about } = req.body;
	try {
		const newAbout = new About({
			shop,
			about,
		});
		await newAbout.save();
		res.status(200).send("About added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.patch("/editabout/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { about } = req.body;
	try {
		await About.findOneAndUpdate({ shop }, { about });
		res.status(200).send("About edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.delete("/removeabout/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		await About.findOneAndDelete({ shop });
		res.status(200).send("About deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

export default router;
