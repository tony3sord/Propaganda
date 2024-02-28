import express from "express";
const router = express.Router();
import Category from "../models/category.js";

//Json for send category
router.get("/allcategory", async (req, res) => {
	const category = await Category.find();
	res.json({ category });
});

//show the viwe of all category
router.get("/category", async (req, res) => {
	const category = await Category.find();
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         res.render('category',{category});
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect("/login");
	// }
	res.render("category", { category });
});

//show the view edit a category with the category to edit
router.get("/editcategory/:id", async (req, res) => {
	const category = await Category.findById(req.params.id);
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         res.render('editcategory', {category});
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect('/login')
	// }
	res.render("editcategory", { category });
});

//show the view add a category
router.get("/addcategory", (req, res) => {
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         res.render('addcategory');
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect('/login');
	// }
	res.render("addcategory");
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
