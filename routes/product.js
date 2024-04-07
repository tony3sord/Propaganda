import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import minioClient from "../file.js";
import express from "express";
const router = express.Router();
import Products from "../models/products.js";
import Opinion from "../models/opnion.js";
import addPhotoMinio from "../minio/addPhoto.js";
import createFolderInBucket from "../minio/createFolder.js";
import category from "../models/category.js";


router.post(
	"/addproduct/:shop",
	upload.array("fotos", 3),
	async (req, res) => {
		const {shop} = req.params;
		const { nombre, precio, descripcion, categoria, cantidad, material } = req.body;
		const fotos = req.files;
		try {
			// if (req.isAuthenticated()) {
			// 	if (req.user.role == "Admin") {
			// 	} else {
			// 		res.status(403).send("No está autorizado para ver esta página");
			// 	}
			// } else {
			// 	res.status(403).send("Debe loguearse para ver esta página");
			// }
			createFolderInBucket("propaganda",shop);
			const imagePaths = await Promise.all(addPhotoMinio(fotos,shop, nombre));
			const newProduct = new Products({
				shop,
				name:nombre,
				price:precio,
				description:descripcion,
				category:categoria,
				amount:cantidad,
				material:material,
				images: [...imagePaths],
			});
			if(await Products.findOne({name:newProduct.name,shop:newProduct.shop})){
				return res.status(400).send("Ya existe un producto con el nombre ingresado");
			}else{
			const a = await newProduct.save();
			if(a){
				return res.status(200).send("Producto añadido correctamente");
			}else{
				return res.status(400).send("Error al añadir el producto");
			}}
		} catch (error) {
			console.log(error);
			return res.status(500).send("Error en el servidor");
		}
	},
);


//show the view edit a product
router.get("/product/:id", async (req, res) => {
	const id = req.params.id;
	// if(req.isAuthenticated()){
	//     if(req.user.role=="admin"){
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
	const product = await Products.findById(id).populate({
		path: 'category',
		select: 'name',
	}).populate({
		path:"material",
		select:'name',
	}).populate({
		path:'shop',
		select:'name'
	}); 
		if (product) {
			const obj = {
				id:product._id,
				nombre:product.name,
				precio:product.price,
				cantidad:product.amount,
				descripcion:product.description,
				categoria:product.category,
				material:product.material,
				tienda:product.shop
			}
			return res.status(200).json(obj);
		} else {
			return res.status(400).send("Error al obtener el producto");
		}
});


//edit a product
router.patch("/editproduct/:id", upload.array("fotos", 3), async (req, res) => {
	const { nombre, precio, descripcion, categoria, cantidad, material } = req.body;
		const fotos = req.files;

	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const product = await Products.findById(req.params.id);
		if (!product) {
			return res.status(404).send("Producto no encontrado");
		}

		// Borrar las imágenes antiguas
		const objectsToRemove = product.images.map((imagePath) => ({
			name: imagePath,
		}));

		minioClient.removeObjects("propaganda", objectsToRemove, function (err) {
			if (err) {
				return console.log("Unable to remove object: ", err);
			}
			console.log("Removed the object.");
		});

		// Subir las nuevas imágenes
		const imagePaths = await Promise.all(addPhotoMinio(fotos,shop, nombre));

		// Actualizar el producto
		product.name = nombre;
		product.price = precio;
		product.description = descripcion;
		product.images = imagePaths;
		product.category = categoria;
		product.amount = cantidad;
		product.material = material;
		product.images = [...imagePaths];
		await product.save();

		return res.status(200).send("Producto actualizado correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error del servidor");
	}
});


//delete a product
router.delete("/deleteproduct/:id", async (req, res) => {
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Admin") {
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
		// Borrar las imágenes
		const objectsToRemove = product.images.map((imagePath) => {
			const url = new URL(imagePath);
			const objectName = url.pathname.replace('/buckets/propaganda/', '');
			return { name: objectName };
		});
		
		minioClient.removeObjects("propaganda", objectsToRemove, function (err) {
			if (err) {
				return console.log("Unable to remove object: ", err);
			}
			console.log("Removed the object.");
		});
		await Products.findByIdAndDelete(req.params.id);
		return res.status(200).send("Producto eliminado correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});


//get all products
router.get("/products/:shop", async (req, res) => {
	const shop = req.params.shop;
	const products = await Products.find({ shop }).populate({
		path: 'category',
		select: 'name -_id',
	}).populate({
		path:"material",
		select:'name -_id',
	})
	const productos = products.map((product) => ({
		id: product._id,
		Nombre: product.name,
		Precio: product.price,
		Descripción: product.descripcion,
		Categoría:product.category.name,
		Material:product.material.name,
		Disponibilidad:product.amount,
		Vendidos:product.sales??0,
	}));
	if (products) {
		res.status(200).json(productos);
	} else {
		res.status(404).send("No se encontraron productos");
	}
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
router.patch("/editopineproduct/:id", async (req, res) => {
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
router.get("/mostsellers/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const products = await Products.find(shop).sort({ amount: -1 }).limit(5);
		res.status(200).json({ products });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//get the most expensive products
router.get("/recents/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const recentProducts = await Products.find(shop)
			.sort({ createdAt: -1 })
			.limit(5);
		res.status(200).json({ recentProducts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//Product updated recently
router.get("/updateproducts/:shop", async (req, res) => {
	const { shop } = req.params;
	try {
		const updateProducts = await Products.find({ shop })
			.sort({ updateAt: -1 })
			.limit(5);
		res.status(200).json({ updateProducts });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error del servidor");
	}
});

//Filter for category
router.get("/product/:shop/:category", async (req, res) => {
	const { shop, category } = req.params;
	try {
		const products = await Products.find({ shop, category });
		if (products) {
			res.status(200).json(products);
		} else {
			res.status(404).send("No hay productos de esta categoría");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

//Filter for material
router.get("/product/:shop/:material", async (req, res) => {
	const { shop, material } = req.params;
	try {
		const products = await Products.find({ shop, material });
		if (products) {
			res.status(200).json(products);
		} else {
			res.status(404).send("No hay productos de este material");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

//Filter for category and material
router.get("/product/:shop/:category/:material", async (req, res) => {
	const { shop, category, material } = req.params;
	try {
		const products = await Products.find({ shop, category, material });
		if (products) {
			res.status(200).json(products);
		} else {
			res
				.status(404)
				.send("No hay productos de esta categoría y de este material");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

export default router;
