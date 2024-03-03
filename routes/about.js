import express from "express";
const router = express.Router();
import About from "../models/about.js";

router.get("/about/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const about = await About.findOne({ shop });
		res.status(200).json({ about });
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addabout/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { about } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
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

router.get("/editabout/:shop/:id", async (req, res) => {
	const id = req.params.id;
	const shop = req.params.shop;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const about = await About.find({ id, shop });
		if (about) {
			res.status(200).json({ about });
		} else {
			console.log("No about found");
			res.status(404).send("No about found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.patch("/editabout/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { about } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
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
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await About.findOneAndDelete({ shop });
		res.status(200).send("About deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

export default router;
