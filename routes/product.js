import express from "express";
const router = express.Router();
import Products from "../models/products.js";
import multer from "multer";
import path from "path";
import Opinion from "../models/opnion.js";
import minioClient from "../file.js";

const upload = multer({ storage: multer.memoryStorage() });

router.post("/addproduct", upload.array("image", 3), async (req, res) => {
	const { name, price, description, category, amount } = req.body;
	const images = req.files;
	console.log(images, "Desde multer");
	try {
		const imageUploadPromises = images.map((image) => {
			const imagePath = image.originalname;
			const imageBuffer = image.buffer;
			const imageType = image.mimetype;

			return new Promise((resolve, reject) => {
				minioClient.putObject(
					"propaganda",
					imagePath,
					imageBuffer,
					imageType,
					function (err, etag) {
						if (err) {
							reject(err);
						} else {
							const imageUrl = `https://your-minio-server.com/propaganda/${imagePath}`;
							resolve(imageUrl);
						}
					},
				);
			});
		});

		const imagePaths = await Promise.all(imageUploadPromises);
		console.log(imagePaths, "desde minio");
		const newProduct = new Products({
			name,
			price,
			description,
			category,
			amount,
			images: [...imagePaths],
		});
		console.log(newProduct, "desde el newProduct");
		const a = await newProduct.save();
		console.log(a, "desde el save");
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
router.patch("/editproduct/:id", upload.array("image", 3), async (req, res) => {
	const { name, price, description, category, amount } = req.body;
	const images = req.files;

	try {
		const product = await Products.findById(req.params.id);
		if (!product) {
			return res.status(404).send("Producto no encontrado");
		}

		// Borrar las imágenes antiguas
		const objectsToRemove = product.image.map((imagePath) => ({
			name: imagePath,
		}));

		minioClient.removeObjects("propaganda", objectsToRemove, function (err) {
			if (err) {
				return console.log("Unable to remove object: ", err);
			}
			console.log("Removed the object.");
		});

		// Subir las nuevas imágenes
		const imagePaths = [];
		for (let image of images) {
			const imagePath = image.path;
			const imageStream = fs.createReadStream(imagePath);
			const imageType = image.mimetype;

			minioClient.putObject(
				"my-bucket",
				imagePath,
				imageStream,
				imageType,
				function (err, etag) {
					if (err) {
						return console.log(err);
					}
					console.log("File uploaded successfully.");
				},
			);

			imagePaths.push(imagePath);
		}

		// Actualizar el producto
		product.name = name;
		product.price = price;
		product.description = description;
		product.images = imagePaths;
		product.category = category;
		product.amount = amount;
		await product.save();

		res.status(200).send("Producto actualizado correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//delete a product
router.delete("/deleteproduct/:id", async (req, res) => {
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "admin") {
		// 		res.status(200).send("Producto eliminado correctamente");
		// 	} else {
		// 		res.status(403).send("No tiene permisos para eliminar el producto");
		// 	}
		// } else {
		// 	res.status(403).send("debe autenticarse");
		// }
		const product = await Products.findById(req.params.id);
		if (!product) {
			return res.status(404).send("Producto no encontrado");
		}
		// Borrar las imágenes
		const objectsToRemove = product.image.map((imagePath) => ({
			name: imagePath,
		}));

		minioClient.removeObjects("propaganda", objectsToRemove, function (err) {
			if (err) {
				return console.log("Unable to remove object: ", err);
			}
			console.log("Removed the object.");
		});
		await Products.findByIdAndDelete(req.params.id);
		res.status(200).send("Producto eliminado correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
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
