import express from "express";
const router = express.Router();
import Shop from "../models/shop.js";
import User from "../models/users.js";

router.get("/shops", async (req, res) => {
	try {
		if (req.user && req.user.role === "superadmin") {
			const shops = await Shop.find();
			res.status(200).json({ shops });
		} else {
			res.status(403).send("No tienes acceso a esta URL");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.get("/shops/:id", async (req, res) => {
	const id = req.params.id;
	try {
		if (req.user && req.user.role === "superadmin") {
			const shop = await Shop.findbyid(id);
			res.json({ shop });
		} else {
			res.status(403).send("No tienes acceso a esta URL");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.post("/addshop", async (req, res) => {
	const { name, user, password } = req.body;
	const admin = {
		user,
		password,
		role: "Admin",
	};
	try {
		const este = await User.create(admin);
		const newShop = new Shop({ name, este });
		await newShop.save();
		res.status(200).send("Tienda Creada Correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

export default router;
