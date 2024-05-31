import express from "express";
const router = express.Router();
import User from "../models/users.js";
import Shop from "../models/shop.js";
import validate from "../utils/validateuser.js";

import passport from "passport";

import configurePassport from "../utils/passport.js";

configurePassport(User);

//register user
router.post("/register", async (req, res) => {
  const { nombre, correo, clave, usuario, confirmarClave } = req.body;
  try {
    if (clave !== confirmarClave)
      return res.status(400).send("No coninciden las claves");
    if (await validate(correo, usuario))
      return res.status(409).send("email o usuario ya registrado");
    const newUser = new User({
      name: nombre,
      email: correo,
      user: usuario,
      password: clave,
      role: "Cliente",
    });
    const usuario1 = await newUser.save();
    return res
      .status(200)
      .json({ message: "Usuario creado correctamente", data: usuario1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    return res.status(200).send("Se ha cerrado la sesión correctamente");
  });
});

//get the current user
router.get("/currentuser", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).send("No hay usuario logueado");
  }
});

//register user
//register user
router.post("/login", function (req, res, next) {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Usuario o Contraseña incorrectos");
    }
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      if (!err) {
        if (user.role == "Admin") {
          const tienda = await Shop.findOne({ admin: user._id });
          user = { ...user.toObject(), tienda: tienda._id };
        }
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

//Login with Google
router.get(
  "/authgoogle",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    return res.status(200).send("Usuario autenticado correctamente");
  },
);

router.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      if (user.role == "Superadmin") {
        return res.status(400).send("No se puede borrar este usuario");
      }
      const deleteUser = await User.deleteOne({ user });
      if (deleteUser) {
        return res.status(200).send("Usuario eliminado correctamente");
      } else {
        return res.status(400).send("Error al eliminar el usuario");
      }
    } else {
      return res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const a = await User.findById(id, { __v: 0 });
    let b;
    if (a) {
      if (a.role == "Admin") {
        const shop = await Shop.findOne({ admin: a });
        b = {
          id: a._id,
          nombre: a.name,
          correo: a.email,
          usuario: a.user,
          tienda: shop.name,
        };
      } else {
        b = {
          id: a._id,
          nombre: a.name,
          correo: a.email,
          usuario: a.user,
        };
      }
      return res.json(b);
    } else {
      return res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

router.patch("/updateuser/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, correo, contrasena, usuario, tienda } = req.body;
  console.log(req.body);
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    const valida = await validate(correo, usuario);
    if (valida && valida._id.toString() !== id)
      return res.status(409).send("Correo o usuario ya registrado");
    if (nombre) user.name = nombre;
    if (correo) user.email = correo;
    if (usuario) user.user = usuario;
    if (contrasena) {
      user.password = contrasena;
    }
    if (tienda) {
      const shop = await Shop.findOne({ name: tienda });
      if (shop) {
        user.role = "Admin";
      }
    }
    await user.save();
    return res.status(200).send("Usuario actualizado correctamente");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
});

export default router;
