import express from "express";
const router = express.Router();
import Help from "../models/help.js";

router.get("/help/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const help = await Help.findOne({ shop });
		res.status(200).json(help);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addhelp/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { help } = req.body;
	try {
		const newHelp = new Help({
			shop,
			help,
		});
		await newHelp.save();
		res.status(200).send("Help added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error server");
	}
});

router.patch("/edithelp/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { help } = req.body;
	try {
		await Help.findOneAndUpdate({ shop }, { help });
		res.status(200).send("Help edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error server");
	}
});

router.delete("/deletehelp/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		await Help.findOneAndDelete({ shop });
		res.status(200).send("Help deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});
