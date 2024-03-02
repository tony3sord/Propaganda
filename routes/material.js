import express from "express";
const router = express.Router();
import Material from "../models/material.js";

router.get("/material/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const material = await Material.findOne({ shop });
		res.status(200).json(material);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addmaterial/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { material } = req.body;
	try {
		const newMaterial = new Material({
			shop,
			material,
		});
		await newMaterial.save();
		res.status(200).send("Material added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.patch("/editmaterial/:shop/:material", async (req, res) => {
	const shop = req.params.shop;
	const material1 = req.params.material;
	const { material } = req.body;
	try {
		await Material.findOneAndUpdate({ shop, material1 }, { material });
		res.status(200).send("Material edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.delete("/deletematerial/:shop/:material", async (req, res) => {
	const shop = req.params.shop;
	const material = req.params.material;
	try {
		await Material.findOneAndDelete({ shop, material });
		res.status(200).send("Material deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server Error");
	}
});

export default router;
