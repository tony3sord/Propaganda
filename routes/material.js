import express from "express";
const router = express.Router();
import Material from "../models/material.js";
import Shop from "../models/shop.js";

router.get("/material/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const material = await Material.find({ shop });
		return res.status(200).json(material);
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
		if(material === 'all'){
			const shops = await Shop.find({});
			for(let i = 0; i < shops.length; i++) {
				const shop = shops[i];
				await Material.findOneAndUpdate(
					{ shop: shop._id, name: material }, 
					{ shop: shop._id, name: material }, 
					{ upsert: true, new: true } 
				);
			}
			return res.status(200).send("Material añadido correctamente a todas las tiendas");
		}else{
			const newMaterial = new Material({
				shop,
				name:material,
			});
			const a =  await Material.findOne({shop,name:material});
			if(a){
				return res.status(400).send("Este material ya existe");
			}else{
				await newMaterial.save();
				return res.status(200).send("Material añadido correctamente");
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.patch("/editmaterial/:shop/:id", async (req, res) => {
	const {shop,id} = req.params.shop;
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
		const a = await Material.findOne({shop, name:material});
		if(a){
			res.status(400).send("Este material ya existe");
		}else{
			await Material.findOneAndUpdate({ shop, _id: id }, { material });
			return res.status(200).send("Material editado correctamente");
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.delete("/deletematerial/:shop/:id", async (req, res) => {
	const {shop,id} = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await Material.findOneAndDelete({ shop, _id: id });
		return res.status(200).send("Material eliminado correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

export default router;
