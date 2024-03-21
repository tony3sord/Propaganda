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
		const shops = await Shop.find({}, { __v: 0 })
			.populate("admin", {
				_id: 0,
				password: 0,
				role: 0,
				email: 0,
				user: 0,
				__v: 0,
			})
			.sort({ _id: -1 });
		const shopsTransformed = shops.map((shop) => ({
			id: shop._id,
			Nombre: shop.name,
			Provincia: shop.province,
			Administrador: shop.admin.name,
		}));
		return res.status(200).json(shopsTransformed);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
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
		return res.json(shop);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.get("/shopsname/:id", async (req, res) => {
	const { id } = req.params;
	try {
		// if (req.isAuthenticated()) {
		// 	if (req.user.role == "Superadmin") {
		// 	} else {
		// 		res.status(403).send("No está autorizado para ver esta página");
		// 	}
		// } else {
		// 	res.status(403).send("Debe loguearse para ver esta página");
		// }
		const shop = await Shop.findOne({ _id: id }, { __v: 0 }).populate("admin", {
			_id: 0,
			role: 0,
			__v: 0,
		});
		const objeto = {
			id: shop._id,
			nombre: shop.name,
			administrador: shop.admin.name,
			usuario: shop.admin.user,
			correo: shop.admin.email,
			contrasena: shop.admin.password,
			provincia: shop.province,
		};
		return res.json(objeto);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
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
		const ver = await User.findOne({ user: user.user });
		const ver1 = await User.findOne({ email: user.email });
		if (ver || ver1)
			return res.status(400).send("Nombre de usuario o correo existente");
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
		const shop = new Shop({
			name: nombre,
			admin: a,
			province: provincia,
			direction,
		});
		const shops = await Shop.findOne({
			province: shop.province,
			name: shop.name,
		});
		if (shops) return res.status(400).send("Ya esta tienda existe");
		await Shop.create(shop);
		return res.status(200).send("Tienda Creada Correctamente");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
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
		const shops = await Shop.findOne({
			province: shop.province,
			name: shop.name,
		});
		if (shops) {
			return res.status(400).send("Ya esta tienda existe");
		} else {
			const b = await Shop.findOneAndUpdate({ _id: id }, shop);
			console.log(b);
			if (a && b) {
				return res.status(200).send("Tienda Editada Correctamente");
			} else {
				return res.status(400).send("No se pudo editar la tienda");
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

router.delete("/deleteshop/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const shop = await Shop.findById(id);
		if (shop) {
			await shop.deleteOne();
			return res.status(200).send("Tienda Eliminada Correctamente");
		} else {
			return res.status(400).send("Error al eliminar la Tienda");
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
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
		const shops = await Shop.find({}, { __v: 0, _id: 0, province: 0 })
			.populate("admin", { __v: 0, password: 0, role: 0, email: 0 })
			.sort({ _id: -1 });
		const shopsTransformed = shops.map((shop) => ({
			id: shop.admin._id,
			Nombre: shop.admin.name,
			Usuario: shop.admin.user,
			Tienda: shop.name,
		}));
		return res.status(200).json(shopsTransformed);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Error en el servidor");
	}
});

export default router;
