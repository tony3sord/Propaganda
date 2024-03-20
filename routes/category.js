import express from "express";
const router = express.Router();
import Category from "../models/category.js";

//Json for send category
router.get("/category/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const category = await Category.findOne({ shop });
		const objeto = category.map((c) => ({
			Categoría: c.name,
		}));
		return res.status(200).json(category);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

//delete category
router.delete("/removecategory/:shop/:id", async (req, res) => {
	const { id, shop } = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		await Category.findOneAndDelete({ id, shop });
		return res.status(200).send("Category deleted successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server error");
	}
});

router.get("/editcategory/:shop/:id", async (req, res) => {
	const { id, shop } = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const category = await Category.findOne({ _id: id, shop });
		if (category) {
			return res.status(200).json(category);
		} else {
			return res.status(404).send("Error al buscar la categoria");
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

//edit category
router.patch("/editcategory/:shop/:id", async (req, res) => {
	const { name } = req.body;
	const { shop, id } = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const a = await Category.findOneAndUpdate(id, shop, {
			name,
		});
		if (a) {
			return res.status(200).send("Categoría editada correctamente");
		} else {
			return res.status(403).send("Error al editar la categoría");
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

//add category
router.post("/addcategory/:shop", async (req, res) => {
	const { name } = req.body;
	const { shop } = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const newCategory = new Category({
			shop,
			name,
		});
		await newCategory.save();
		return res.status(200).send("Category added successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server error");
	}
});

export default router;
