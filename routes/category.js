import express from "express";
const router = express.Router();
import Category from "../models/category.js";
import Shop from "../models/shop.js";

//Json for send category
router.get("/category/:shop", async (req, res) => {
  const { shop } = req.params;
  try {
    const category = await Category.find({ shop });
    const categorys = category.map((c) => ({
      id: c._id,
      Nombre: c.name,
    }));
    return res.status(200).json(categorys);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

//delete category
router.delete("/removecategory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    await Category.findOneAndDelete({ _id: id });
    return res.status(200).send("Categoría eliminada correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const category = await Category.findById(id);
    console.log(category);
    const object = {
      nombre: category.name,
      tienda: category.shop,
      id_category: category._id,
    };
    if (category) {
      return res.status(200).json(object);
    } else {
      return res.status(404).send("Error al buscar la categoria");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

//edit category
router.patch("/editcategory/:id", async (req, res) => {
  const { categoria, tienda } = req.body;
  const { id } = req.params;
  console.log(categoria, tienda);
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    console.log(tienda);
    const b = await Category.findOne({ shop: tienda, name: categoria });
    if (b) {
      return res.status(400).send("Esta categoría ya existe");
    }
    const a = await Category.findByIdAndUpdate(id, {
      name: categoria,
    });
    console.log(a);
    if (!a) return res.status(400).send("Error al editar la categoría");
    return res.status(200).send("Categoría editada correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

//add category
router.post("/addcategory/:shop", async (req, res) => {
  const { categoria } = req.body;
  const { shop } = req.params;
  console.log(shop);
  console.log(categoria);
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    if (shop === "all") {
      // Suponiendo que tienes un modelo Shop para las tiendas
      const shops = await Shop.find({});

      for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        await Category.findOneAndUpdate(
          { shop: shop._id, name: categoria },
          { shop: shop._id, name: categoria },
          { upsert: true, new: true },
        );
      }
      return res
        .status(200)
        .send("Categoría añadida correctamente a todas las tiendas");
    } else {
      const newCategory = new Category({
        shop,
        name: categoria,
      });
      const a = await Category.findOne({ shop, name: categoria });
      if (a) {
        return res.status(400).send("Esta categoría ya existe");
      } else {
        await newCategory.save();
        return res.status(200).send("Categoría añadida correctamente");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

export default router;
