import express from "express";
const router = express.Router();
import Information from "../models/information.js";

router.get("/information/:shop", async (req, res) => {
  const shop = req.params.shop;
  try {
    const information = await Information.findOne({ shop });
    if (information) {
      const obj = {
        id: information._id,
        servicios: information.service,
        ayuda: information.help,
        sobreNosotros: information.about,
        telefono: information.phone,
        correo: information.gmail,
        direccion: information.direction,
      };
      return res.status(200).json(obj);
    } else {
      return res.status(404).send("No hay informaciones de esta tienda");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router.post("/addinformation/:shop", async (req, res) => {
  const { shop } = req.params;
  const { servicios, ayuda, sobreNosotros, correo, direccion, telefono } =
    req.body;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const validar = await Information.findOne({ shop });
    if (validar) {
      return res
        .status(400)
        .send("Ya esta tiend tiene información, por favor, edítela");
    }
    const information = await Information.create({
      shop,
      service: servicios,
      help: ayuda,
      about: sobreNosotros,
      gmail: correo,
      phone: telefono,
      direction: direccion,
    });
    if (information) {
      return res.status(200).send("Información insertada correctamente");
    } else {
      return res.status(400).send("Error al insertar la información");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

router.get("/editinformation/:shop", async (req, res) => {
  const { shop } = req.params;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const information = await Information.findOne({ shop });
    if (information) {
      const obj = {
        servicios: information.service,
        ayuda: information.help,
        sobreNosotros: information.about,
        telefono: information.phone,
        correo: information.gmail,
        direccion: information.direction,
        tienda: information.shop,
      };
      console.log(obj);
      return res.status(200).json(obj);
    } else {
      return res.status(400).send("Esta tienda no tiene información");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router.patch("/editinformation/:id", async (req, res) => {
  const { id } = req.params;
  const { servicios, ayuda, sobreNosotros, correo, direccion, telefono } =
    req.body;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const information = await Information.findByIdAndUpdate(id, {
      service: servicios,
      help: ayuda,
      about: sobreNosotros,
      gmail: correo,
      phone: telefono,
      direction: direccion,
    });
    if (information) {
      return res.status(200).send("Información editada correctamente");
    } else {
      return res.status(400).send("No se pudo editar la Información");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router.delete("/removeinformation/:shop", async (req, res) => {
  const shop = req.params.shop;
  try {
    // if (req.isAuthenticated()) {
    // 	if (req.user.role == "Admin") {
    // 	} else {
    // 		res.status(403).send("No está autorizado para ver esta página");
    // 	}
    // } else {
    // 	res.status(403).send("Debe loguearse para ver esta página");
    // }
    const information = await Information.findOneAndDelete({ shop });
    if (information) {
      return res.status(200).send("Información eliminada correctamente");
    } else {
      return res.status(400).send("No se pudo eliminar la información");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

export default router;
