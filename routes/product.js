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
		res.status(200).send("Producto añadido correctamente");
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
			res.status(404).send("Error al obtener el producto");
		} else {
			res.status(200).send("Producto obtenido correctamente").json({ product });
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
					res.status(404).send("Error al actualizar el producto ");
				} else {
					res.status(200).send("Producto actualizado correctamente");
				}
			},
		);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//delete a product
router.delete("/removeproduct/:id", async (req, res) => {
	const id = req.params.id;
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
	//         await Products.findByIdAndDelete(id, (err, doc) => {
	//             if(err){
	//                 res.status(500).send("Error al eliminar el producto");
	//             }else{
	//                 res.status(200).send("Producto eliminado correctamente");
	//             }
	//         })
	//     }else{
	//         res.status(403).send("No tiene permisos para eliminar el producto");
	//     }
	// }else{
	//     res.status(403).send("Debe autenticarse");
	// }
	await Products.findByIdAndDelete(id, (err) => {
		if (err) {
			res.status(500).send("Error al eliminar el producto");
		} else {
			res.status(200).send("Producto eliminado correctamente");
		}
	});
});

//get all products
router.get("/products", async (req, res) => {
	const products = await Products.find({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.status(200).json({ products });
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
			opinion.assessments = assessment;
			await opinion.save();
			res.status(200).send("Opinión guardada correctamente");
		} else {
			res.status(403).send("Debe autenticarse");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
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
			res.status(200).send("Opinión guardada correctamente");
		} else {
			res.status(403).send("Debe autenticarse");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
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
		res.status(500).send("Error del servidor");
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
		res.status(500).send("Error del servidor");
	}
});

//get the most sold products
router.get("/mostsellers", async (req, res) => {
	try {
		const products = await Products.find().sort({ amount: -1 }).limit(5);
		res.status(200).json({ products });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//get the most expensive products
router.get("/recents", async (req, res) => {
	try {
		const recentProducts = await Products.find()
			.sort({ createdAt: -1 })
			.limit(5);
		res.status(200).json({ recentProducts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//Product updated recently
router.get("/updateproducts", async (req, res) => {
	try {
		const updateProducts = await Products.find()
			.sort({ updateAt: -1 })
			.limit(5);
		res.status(200).json({ updateProducts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

export default router;
