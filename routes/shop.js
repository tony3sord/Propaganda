import express from "express";
const router = express.Router();
import Shop from "../models/shop.js";
import User from "../models/users.js";

router.get("/shops", async (req, res) => {
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shops = await Shop.find();
		res.json({ shops });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.get("/shops/:id", async (req, res) => {
	const id = req.params.id;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shop = await Shop.findbyid(id);
		res.json({ shop });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.post("/addshop", async (req, res) => {
	const { name, nameuser, nameadmin, password, province, direction } = req.body;
	const user = {
		name: nameuser,
		user: nameadmin,
		password,
		role: "Admin",
	};
	const shop = {
		name,
		user,
		province,
		direction,
	};
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await User.findOneAndUpdate({ user }, user, { upsert: true });
		const newShop = new Shop({ shop });
		await newShop.save();
		res.status(200).send("Tienda Creada Correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.patch("/editshop/:id", async (req, res) => {
	const id = req.params.id;
	const { name, nameuser, nameadmin, password, province, direction } = req.body;
	const user = {
		name: nameuser,
		user: nameadmin,
		password,
		role: "Admin",
	};
	const shop = {
		name,
		user,
		province,
		direction,
	};
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await User.findOneAndUpdate({ user }, user, { upsert: true });
		await Shop.findOneAndUpdate({ id }, { shop });
		res.status(200).send("Tienda Editada Correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.delete("/deleteshop/:id", async (req, res) => {
	const id = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shop = await Shop.findById(id);
		await User.findByIdAndDelete(shop.user);
		await Shop.findByIdAndDelete(id);
		res.status(200).send("Tienda Eliminada Correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

export default router;
