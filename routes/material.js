import express from "express";
const router = express.Router();
import Material from "../models/material.js";

router.get("/material/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const material = await Material.findOne({ shop });
		const objeto = material.map((m) => ({
			Material: m.name,
		}));
		return res.status(200).json(objeto);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.get("/material/:shop/:id", async (req, res) => {
	const { shop, id } = req.params;
	try {
		const material = await Material.findOne({ shop, _id: id });
		return res.status(200).json(material);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.post("/addmaterial/:shop", async (req, res) => {
	const { shop } = req.params;
	const { material } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const newMaterial = new Material({
			shop,
			material,
		});
		await newMaterial.save();
		return res.status(200).send("Material añadido correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.patch("/editmaterial/:shop/:material", async (req, res) => {
	const shop = req.params.shop;
	const material1 = req.params.material;
	const { material } = req.body;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await Material.findOneAndUpdate({ shop, name: material1 }, { material });
		return res.status(200).send("Material editado correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.delete("/deletematerial/:shop/:material", async (req, res) => {
	const shop = req.params.shop;
	const material = req.params.material;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await Material.findOneAndDelete({ shop, name: material });
		return res.status(200).send("Material eliminado correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

export default router;
