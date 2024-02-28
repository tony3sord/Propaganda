import express from "express";
const router = express.Router();
import Category from "../models/category.js";

//Json for send category
router.get("/allcategory", async (req, res) => {
	const category = await Category.find();
	res.json({ category });
});

//delete category
router.delete("/removecategory/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await Category.findByIdAndDelete(id);
		res.status(200).send("Category deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

//edit category
router.patch("/editcategory/:id", async (req, res) => {
	const { name } = req.body;
	try {
		await Category.findByIdAndUpdate(req.params.id, {
			name,
		});
		res.status(200).send("Category edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

//add category
router.post("/addcategory", async (req, res) => {
	const { name } = req.body;
	console.log(name);
	try {
		const newCategory = new Category({
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
