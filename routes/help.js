import express from "express";
const router = express.Router();
import Help from "../models/help.js";

router.get("/help/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const help = await Help.findOne({ shop });
		return res.status(200).json(help);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server error");
	}
});

router.post("/addhelp/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { help } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const newHelp = new Help({
			shop,
			help,
		});
		await newHelp.save();
		return res.status(200).send("Help added successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error server");
	}
});

router.patch("/edithelp/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { help } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await Help.findOneAndUpdate({ shop }, { help });
		return res.status(200).send("Help edited successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error server");
	}
});

router.delete("/deletehelp/:shop", async (req, res) => {
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
		await Help.findOneAndDelete({ shop });
		return res.status(200).send("Help deleted successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server error");
	}
});

export default router;
