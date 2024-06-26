import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import express from "express";
const router = express.Router();
import Products from "../models/products.js";
import Opinion from "../models/opnion.js";
import addPhotoMinio from "../minio/addPhoto.js";
import createFolderInBucket from "../minio/createFolder.js";
import getPhoto from "../minio/getPhoto.js";
import removePhoto from "../minio/removePhoto.js";
import validate from "../utils/validateproduct.js";

router.post("/addproduct/:shop", upload.array("fotos", 3), async (req, res) => {
  const { shop } = req.params;
  const { nombre, precio, descripcion, categoria, cantidad, material } =
    req.body;
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
    if (await validate(nombre, shop)) {
      return res
        .status(400)
        .send("Ya existe un producto con el nombre ingresado");
    }
    createFolderInBucket("propaganda", shop);
    const imagePaths = await Promise.all(addPhotoMinio(fotos, shop, nombre));
    const newProduct = new Products({
      shop,
      name: nombre,
      price: precio,
      description: descripcion,
      category: categoria,
      amount: cantidad,
      material: material,
      images: [...imagePaths],
    });
    const a = await newProduct.save();
    if (a) {
      return res.status(200).send("Producto añadido correctamente");
    } else {
      return res.status(400).send("Error al añadir el producto");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

router.get("/:id", async (req, res) => {
  console.log("Hola");
  const id = req.params.id;
  const product = await Products.findById(id)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "material",
      select: "name",
    })
    .populate({
      path: "shop",
      select: "name",
    });
  if (product) {
    let a = [];
    for (const element of product.images) {
      a.push(getPhoto("propaganda", element));
    }
    const obj = {
      id: product._id,
      nombre: product.name,
      precio: product.price,
      cantidad: product.amount,
      descripcion: product.description,
      categoria: product.category.name,
      material: product.material.name,
      tienda: product.shop,
      fotos: await Promise.all(a),
    };
    console.log(obj);
    return res.status(200).json(obj);
  } else {
    return res.status(400).send("Error al obtener el producto");
  }
});

//show the view edit a product
router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Products.findById(id)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "material",
      select: "name",
    })
    .populate({
      path: "shop",
      select: "name",
    });
  if (product) {
    let a = [];
    for (const element of product.images) {
      a.push(getPhoto("propaganda", element[0]));
    }
    const obj = {
      id: product._id,
      nombre: product.name,
      precio: product.price,
      cantidad: product.amount,
      descripcion: product.description,
      categoria: product.category,
      material: product.material,
      tienda: product.shop,
      fotos: await Promise.all(a),
    };
    return res.status(200).json(obj);
  } else {
    return res.status(400).send("Error al obtener el producto");
  }
});

//edit a product
router.patch("/editproduct/:id", upload.array("fotos", 3), async (req, res) => {
  const { nombre, precio, descripcion, categoria, cantidad, material, tienda } =
    req.body;
  const { id } = req.params;
  const fotos = req.files;
  let imagePaths;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    const validar = await validate(nombre, tienda);
    if (validar && validar._id !== id) {
      return res
        .status(400)
        .send("Ya existe un producto con el nombre ingresado");
    }

    const objectsToRemove = product.images.map((imagePath) => {
      return imagePath;
    });
    removePhoto(objectsToRemove);

    if (fotos) {
      imagePaths = await Promise.all(addPhotoMinio(fotos, tienda, nombre));
    }
    const a = await Products.findByIdAndUpdate(id, {
      name: nombre,
      price: precio,
      description: descripcion,
      category: categoria,
      amount: cantidad,
      material: material,
      images: imagePaths,
    });
    if (a) {
      return res.status(200).send("Producto actualizado correctamente");
    } else {
      return res.status(400).send("Error al actualizar el producto");
    }
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
    const objectsToRemove = product.images.map((imagePath) => {
      return imagePath;
    });
    removePhoto(objectsToRemove);
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
  const products = await Products.find({ shop })
    .populate({
      path: "category",
      select: "name -_id",
    })
    .populate({
      path: "material",
      select: "name -_id",
    });
  const productos = products.map((product) => ({
    id: product._id,
    Nombre: product.name,
    Precio: product.price,
    Descripción: product.descripcion,
    Categoría: product.category.name,
    Material: product.material.name,
    Disponibilidad: product.amount,
    Vendidos: product.sales ?? 0,
  }));
  if (products) {
    res.status(200).json(productos);
  } else {
    res.status(404).send("No se encontraron productos");
  }
});

//assesment a product
router.post("/assesmentproduct/:id/:user", async (req, res) => {
  const id = req.params.id;
  const assessment = req.body.estrellasSeleccionadas;
  const user = req.params.user;
  try {
    if (user) {
      const product = await Products.findById(id);
      let opinion = await Opinion.findOne({ product: product, user });
      if (!opinion) {
        opinion = new Opinion({ product, user: req.user });
      }
      opinion.assessments = assessment;
      await opinion.save();
      return res.status(200).send("Valoración guardada correctamente");
    } else {
      return res.res.status(403).send("Debe autenticarse");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error del servidor");
  }
});

router.get("/valoraciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const opiniones = await Opinion.find({ product: id });
    if (opiniones) {
      const valoraciones = opiniones.map((opinion) => ({
        valoracion: opinion.assessments,
      }));
      let promedio = 0;
      console.log(valoraciones);
      let cont = 0;
      for (const valoracion of valoraciones) {
        if (valoracion.valoracion != undefined) {
          promedio += valoracion.valoracion;
          cont++;
        }
      }
      promedio = promedio / cont;
      console.log(promedio, "promedio");
      return res.status(200).json(promedio);
    } else {
      return res.status(404).send("No hay valoraciones");
    }
  } catch (error) {
    console.log(error);
  }
});

//opine a product
router.post("/opineproduct/:id/:user", async (req, res) => {
  const { id, user } = req.params;
  const opinionText = req.body.textArea;
  try {
    if (user) {
      const product = await Products.findById(id);
      let opinion = await Opinion.findOne({ product: product, user });
      if (!opinion) {
        opinion = new Opinion({ product, user });
      }
      opinion.opinions = opinionText;
      await opinion.save();
      return res.status(200).send("Opinión guardada correctamente");
    } else {
      return res.status(403).send("Debe autenticarse");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error del servidor");
  }
});

//edit opine a product
router.patch("/editopineproduct/:id/:user", async (req, res) => {
  const id = req.params.id;
  const opinionText = req.body.textArea;
  const user = req.params.user;
  try {
    await Opinion.findOneAndUpdate(
      { product: id, user },
      {
        $set: { opinions: opinionText },
      },
    );
    res.status(200).send("Opinión eliminada correctamente");
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
    res.status(200).json(recentProducts);
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
router.get("/productos/:shop/:category", async (req, res) => {
  const { shop, category } = req.params;
  try {
    const products = await Products.find({ shop, category });
    if (products) {
      const productos = products.map((product) => ({
        id: product._id,
        Nombre: product.name,
        Precio: product.price,
        Descripción: product.descripcion,
        Categoría: product.category.name,
        Material: product.material.name,
        Disponibilidad: product.amount,
        Vendidos: product.sales ?? 0,
      }));
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
router.get("/productos/:shop/:material", async (req, res) => {
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

router.get("/opiniones/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    if (id) {
      const opiniones = await Opinion.find({ product: id }).populate("user");
      if (opiniones) {
        const opinionesArray = opiniones.map((opinion) => ({
          opinion: opinion.opinions,
          usuario: opinion.user.user,
          id: opinion._id,
        }));
        return res.json(opinionesArray);
      } else {
        return res.status(404).send("No hay opiniones");
      }
    } else {
      res.status(404).send("No hay opiniones");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/busqueda/:buscador/:shop", async (req, res) => {
  const { buscador, shop } = req.params;
  const buscar = new RegExp(buscador, "i");
  try {
    const products = await Products.find({
      $or: [{ name: buscar }, { description: buscar }],
      $and: [{ shop }],
    })
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "material",
        select: "name -_id",
      });
    Promise.all(
      products.map(async (product) => ({
        fotos: await getPhoto("propaganda", product.images[0]),
        id: product._id,
        nombre: product.name,
        precio: product.price,
        descripcion: product.description,
        categoria: product.category.name,
        material: product.material.name,
        disponibilidad: product.amount,
        vendidos: product.sales ?? 0,
      })),
    ).then((productos) => {
      if (productos.length > 0) {
        return res.status(200).json(productos);
      } else {
        return res.status(404).send("No se encontraron productos");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

export default router;
