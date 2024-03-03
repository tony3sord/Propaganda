import express from "express";
const router = express.Router();
import Category from "../models/category.js";

//Json for send category
router.get("/allcategory/:shop", async (req, res) => {
	const shop = req.params.shop;
	const category = await Category.findOne({ shop });
	res.status(200).json({ category });
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
		res.status(200).send("Category deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
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
		const category = await Category.find({ id, shop });
		if (category) {
			res.status(200).json({ category });
		} else {
			res.status(404).send("No category found");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
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
		await Category.findOneAndUpdate(id, shop, {
			name,
		});
		res.status(200).send("Category edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

//add category
router.post("/addcategory/:shop", async (req, res) => {
	const { name } = req.body;
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
		const newCategory = new Category({
			shop,
			name,
		});
		await newCategory.save();
		res.status(200).send("Category added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

export default router;
