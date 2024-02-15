import express from "express";
const router = express.Router();
import Products from "../models/products.js";
import multer from "multer";
import path from "path";
import Opinion from "../models/opnion.js";

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

//get all products
router.get("/products", async (req, res) => {
	const products = await Products.find({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.render("products", { products });
		}
	});
});

//assesment a product
router.post("/assesmentproduct/:id", async (req, res) => {
	const id = req.params.id;
	const assessment = req.body.assessment;
	try {
		if (req.isAuthenticated()) {
			const product = await Products.findById(id);
			let opinion = await Opinion.findOne({ product: product, user: req.user });
			if (!opinion) {
				opinion = new Opinion({ product, user: req.user });
			}
			opinion.assessment = assessment;
			await opinion.save();
		} else {
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
	}
});

//opine a product
router.post("/opineproduct/:id", async (req, res) => {
	const id = req.params.id;
	const opinionText = req.body.opinion;
	try {
		if (req.isAuthenticated()) {
			const product = await Products.findById(id);
			let opinion = await Opinion.findOne({ product: product, user: req.user });
			if (!opinion) {
				opinion = new Opinion({ product, user: req.user });
			}
			opinion.opinions = opinionText;
			await opinion.save();
		} else {
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
	}
});

//edit opine a product
router.post("/editopineproduct/:id", async (req, res) => {
	const id = req.params.id;
	const opinionText = req.body.opinion;
	const user = req.user;
	try {
		if (req.isAuthenticated()) {
			await Opinion.findOneAndUpdate(
				{ product: id, user: user._id },
				{
					$set: { opinions: opinionText },
				},
			);
		} else {
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
	}
});

//delete opine a product
router.delete("/deleteopinionproduct/:id", async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	try {
		const opinion = await Opinion.findOneAndUpdate(
			{ product: id, user: user._id },
			{ $unset: { opinion: 1 } },
		);
		if (opinion) {
			res.status(200).send("Opinión eliminada correctamente");
		} else {
			res
				.status(404)
				.send(
					"No es el usuario que ha escrito la opinión o no existe la opinión",
				);
		}
	} catch (error) {
		console.log(error);
	}
});

//get the most sold products
router.get("/mostsellers", async (req, res) => {
	try {
		const products = await Products.find().sort({ amount: -1 }).limit(5);
		res.json({ products });
	} catch (error) {
		console.log(error);
	}
});

export default router;
