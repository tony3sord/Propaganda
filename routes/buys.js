import express from "express";
const router = express.Router();
import Buys from "../models/buys.js";
import Basket from "../models/basket.js";
import Products from "../models/products.js";

//show the view of the buys
router.get("/buys", async (req, res) => {
	try {
		const buys = await Buys.find();
		// if(req.isAuthenticated()){
		//     if(req.user.role == "admin"){
		//         res.render('/buys',{buys});
		//     }else{
		//         res.redirect('/');
		//     }
		// }else{
		//     res.redirect('/login');
		// }
		res.status(200).json({ buys });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error al obtener las compras");
	}
});

//to deliver a purchase
router.get("/deliveredbuys/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await Buys.findByIdAndUpdate(id, { delivered: true });
		res.status(200).send("Compra entregada");
	} catch (error) {
		console.log(error);
		res.status(500).send("Error al entregar la compra");
	}
});

router.post("/buy/:basketId", async (req, res) => {
	const basketId = req.params.basketId;
	try {
		const basket = await Basket.findById(basketId);
		for (let i = 0; i < basket.product.length; i++) {
			await Products.findByIdAndUpdate(basket.product[i]._id, {
				$inc: { amount: -1, sales: +1 },
			});
		}
		const newBuy = new Buys({
			basket,
			shop,
			street,
			number,
			city,
			country,
			delivered,
		});
		await newBuy.save();
		res.status(200).json({ newBuy });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error al realizar la compra");
	}
});

router.get("/bestsellers", async (req, res) => {
	const bestsellers = await Products.find().sort({ sales: -1 }).limit(10);
	res.json({ bestsellers });
});

export default router;
