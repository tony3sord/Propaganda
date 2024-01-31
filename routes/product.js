import express from "express";
const router = express.Router();
import Products from "../models/products.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/images");
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const filename = `${Date.now()}${ext}`;
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

//show the view add a product
router.get("/addproduct", (req, res) => {
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         res.render('addproduct');
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect('/login');
	// }
	res.render("addproduct");
});

//add a product
router.post("/addproduct", upload.array("image", 3), async (req, res) => {
	const { name, price, description, category, amount } = req.body;
	const image = req.files.map((file) => file.path);
	try {
		const newProduct = new Products({
			name,
			price,
			description,
			image,
			category,
			amount,
		});
		await newProduct.save();
		res.redirect("/");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error al guardar el producto");
	}
});

//show the view edit a product
router.get("/editproduct/:id", async (req, res) => {
	const id = req.params.id;
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         //Here the product is edited
	//         Products.findById(id, (err, doc) => {
	//             if(err){
	//                 console.log(err);
	//             }else{
	//                 res.render('editproduct', {product:doc});
	//             }
	//         })
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect('/login');
	// }
	const product = await Products.findById(id, (err, doc) => {
		if (err) {
			console.log(err);
		} else {
			res.render("editproduct", { product });
		}
	});
});

//edit a product
router.post("/editproduct/:id", async (req, res) => {
	const { name, price, description, category, amount } = req.body;
	const image = req.files.map((file) => file.path);
	try {
		//edit a product
		await Products.findByIdAndUpdate(
			req.params.id,
			{
				name,
				price,
				description,
				image,
				category,
				amount,
			},
			(err, doc) => {
				if (err) {
					console.log(err);
				} else {
					res.redirect("/");
				}
			},
		);
	} catch (error) {
		console.log(error);
	}
});

//delete a product
router.delete("/removeproduct/:id", async (req, res) => {
	const id = req.params.id;
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         await Products.findByIdAndDelete(id, (err, doc) => {
	//             if(err){
	//                 console.log(err);
	//             }else{
	//                 res.redirect('/');
	//             }
	//         })
	//     }else{
	//         res.redirect('/');
	//     }
	// }else{
	//     res.redirect('/login');
	// }
	await Products.findByIdAndDelete(id, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

router.get("/products", async (req, res) => {
	const products = await Products.find({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.render("products", { products });
		}
	});
});

export default router;
