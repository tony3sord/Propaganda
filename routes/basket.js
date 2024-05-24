import express from "express";
const router = express.Router();
import Basket from "../models/basket.js";
import Product from "../models/products.js";
import getPhoto from "../minio/getPhoto.js";
import mongoose from "mongoose";

//Send the basket like a JSON Object
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const basket = await Basket.findOne({ user: id })
      .populate({
        path: "products.product",
        select: "name price images description category material _id",
        populate: [
          {
            path: "category",
            select: "name -_id",
          },
          {
            path: "material",
            select: "name -_id",
          },
        ],
      })
      .select("products.product products.quantity -_id");

    // Si la cesta no existe, retornar un mensaje
    if (!basket) {
      return res.status(200).json([]);
    }

    const products = await Promise.all(
      basket.products.map(async (element) => {
        const a = element.product.images.map((image) =>
          getPhoto("propaganda", image[0]),
        );

        const fotos = await Promise.all(a);

        return {
          id: element.product._id,
          nombre: element.product.name,
          precio: element.product.price,
          cantidad: element.quantity,
          descripcion: element.product.description,
          categoria: element.product.category.name,
          material: element.product.material.name,
          fotos,
        };
      }),
    );

    console.log(products[0]);
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

//Add a product to the basket
router.post("/addproductstobasket/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log(req.body, "Directo del body");
  const quantity = req.body.cant;
  console.log(quantity, "La cantidad");
  const usuario = req.body.idCliente;
  console.log(usuario, "el usaurio que llega");
  if (!usuario) {
    return res.send("Manda el usuario veijoooooo");
  }
  console.log("Paso por aqui");
  let basket = await Basket.findOne({ user: usuario });
  console.log("Busco la cesta del usuario ", usuario);
  if (!basket) {
    basket = await Basket.create({ user: usuario, products: [] });
    console.log("Creo la cesta del usario", usuario);
  }

  // Buscar el producto en la cesta
  const productInBasket = basket.products.find(
    (item) => item.product.toString() === product._id.toString(),
  );

  if (productInBasket) {
    // Si el producto ya está en la cesta, incrementar la cantidad
    productInBasket.quantity += quantity;
  } else {
    // Si el producto no está en la cesta, agregarlo
    basket.products.push({ product: product, quantity: quantity });
  }

  const a = await basket.save();
  console.log("Pso por actualizar la cesta", a);
  return res.status(200).send("Producto insertado a la cesta");
});

//Delete a product of the basket
router.delete("/borraruno/:producto/:usuario", async (req, res) => {
  const { producto, usuario } = req.params;
  await Basket.updateOne(
    { user: usuario },
    { $pull: { products: { product: new mongoose.Types.ObjectId(producto) } } },
  );

  const basket = await Basket.findOne({ user: usuario }).populate(
    "products.product",
  );

  if (!basket) {
    return res.status(200).json([]);
  }

  const products = await Promise.all(
    basket.products.map(async (element) => {
      const a = element.product.images.map((image) =>
        getPhoto("propaganda", image[0]),
      );

      const fotos = await Promise.all(a);

      return {
        id: element.product._id,
        nombre: element.product.name,
        precio: element.product.price,
        cantidad: element.quantity,
        descripcion: element.product.description,
        categoria: element.product.category.name,
        material: element.product.material.name,
        fotos,
      };
    }),
  );

  return res.status(200).json(products);
});

//Delete the basket
router.delete("/borrarcesta/:usuario", async (req, res) => {
  const { usuario } = req.params;
  await Basket.deleteOne({ user: usuario });
  return res.status(200).send("Cesta eliminada");
});

export default router;
