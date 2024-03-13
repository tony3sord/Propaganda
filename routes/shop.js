import express from "express";
const router = express.Router();
import Shop from "../models/shop.js";
import User from "../models/users.js";

router.get("/shops", async (req, res) => {
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shops = await Shop.find({}, { _id: 0, __v: 0 }).populate("admin", {
			_id: 0,
			password: 0,
			role: 0,
			email: 0,
			user: 0,
			__v: 0,
		});
		const shopsTransformed = shops.map((shop) => ({
			Nombre: shop.name,
			Provincia: shop.province,
			Administrador: shop.admin.name,
		}));
		res.status(200).json(shopsTransformed);
	} catch (error) {
		console.log(error);
		if (!res.headersSent) {
			res.status(500).send("Error en el servidor");
		}
	}
});

router.get("/shops/:id", async (req, res) => {
	const id = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shop = await Shop.findbyid(id);
		res.json(shop);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.get("/shopsname/:name", async (req, res) => {
	const { name } = req.params;
	console.log(name);
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shop = await Shop.findOne({ name }, { _id: 0, __v: 0 }).populate(
			"admin",
			{ _id: 0, role: 0, __v: 0 },
		);
		console.log(shop);
		const objeto = {
			nombre: shop.name,
			administrador: shop.admin.name,
			usuario: shop.admin.user,
			correo: shop.admin.email,
			contrasena: shop.admin.password,
			provincia: shop.province,
		};
		res.json(objeto);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.post("/addshop", async (req, res) => {
	const {
		nombre,
		administrador,
		usuario,
		correo,
		contrasena,
		provincia,
		direction,
	} = req.body;
	const user = {
		name: administrador,
		user: usuario,
		email: correo,
		password: contrasena,
		role: "Admin",
	};
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const a = await User.findOneAndUpdate({ user: usuario }, user, {
			upsert: true,
			new: true,
		});
		const shop = {
			name: nombre,
			admin: a,
			province: provincia,
			direction,
		};
		await Shop.create(shop);
		res.status(200).send("Tienda Creada Correctamente");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.patch("/editshop/:id/:adminviejo", async (req, res) => {
	const { id, adminviejo } = req.params;
	console.log(id, "name");
	const {
		nombre,
		administrador,
		usuario,
		correo,
		contrasena,
		provincia,
		direccion,
	} = req.body;
	const user = {
		name: administrador,
		user: usuario,
		email: correo,
		password: contrasena,
		role: "Admin",
	};
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const a = await User.findOneAndUpdate({ user: adminviejo }, user, {
			upsert: true,
			new: true,
		});

		const shop = {
			name: nombre,
			admin: a,
			province: provincia,
			direction: direccion,
		};
		const b = await Shop.findOneAndUpdate({ name: id }, shop);

		if (a && b) {
			res.status(200).send("Tienda Editada Correctamente");
		} else {
			res.status(400).send("No se pudo editar la tienda");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.delete("/deleteshop/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const shop = await Shop.findOne({ name: id });
		if (shop) {
			await shop.deleteOne();
			res.status(200).send("Tienda Eliminada Correctamente");
		} else {
			res.status(400).send("Error al eliminar la Tienda");
		}
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

router.get("/adminshops", async (req, res) => {
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shops = await Shop.find({}, { __v: 0, _id: 0, province: 0 }).populate(
			"admin",
			{ _id: 0, __v: 0, password: 0, role: 0, email: 0 },
		);
		const shopsTransformed = shops.map((shop) => ({
			Nombre: shop.admin.name,
			Usuario: shop.admin.user,
			Tienda: shop.name,
		}));
		res.status(200).json(shopsTransformed);
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el servidor");
	}
});

export default router;
