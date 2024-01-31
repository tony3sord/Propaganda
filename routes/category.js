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
	try {
		await Category.findByIdAndDelete(req.params.id);
	} catch (error) {
		console.log(error);
	}
	res.redirect("/category");
});

//edit category
router.post("/editcategory/:id", async (req, res) => {
	const { name } = req.body;
	try {
		await Category.findByIdAndUpdate(req.params.id, {
			name,
		});
	} catch (error) {
		console.log(error);
	}
	res.redirect("/category");
});

//add category
router.post("/addcategory", async (req, res) => {
	const { name } = req.body;
	try {
		const newCategory = new Category({
			name,
		});
		await newCategory.save();
	} catch (error) {
		console.log(error);
	}
	res.redirect("/category");
});

export default router;
