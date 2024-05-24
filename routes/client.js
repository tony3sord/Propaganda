import express from "express";
const router = express.Router();
import Shop from "../models/shop.js";
import Products from "../models/products.js";
import getPhoto from "../minio/getPhoto.js";

router.get("/selectprovince", async (req, res) => {
  const shops = await Shop.find();
  let objs = shops.map((shop) => {
    return {
      provincia: shop.province,
      nombre: shop.name,
      id: shop._id,
    };
  });
  return res.json(objs);
});

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
});

router.get("/productos/:shop/:category", async (req, res) => {
  const { shop, category } = req.params;

  const products = await Products.find({ shop, category })
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
});

router.get("/products/:shop/:material", async (req, res) => {
  const { shop, material } = req.params;

  const products = await Products.find({ shop, material })
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
});

router.get("/recents/:shop", async (req, res) => {
  const { shop } = req.params;
  try {
    const recentProducts = await Products.find({ shop })
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "material",
        select: "name -_id",
      })
      .sort({ createdAt: -1 });

    Promise.all(
      recentProducts.map(async (product) => ({
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
    ).then((recentProducts) => {
      if (recentProducts.length > 0) {
        return res.status(200).json(recentProducts);
      } else {
        return res.status(404).send("No se encontraron productos");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error del servidor");
  }
});

export default router;
