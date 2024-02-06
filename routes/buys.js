import express from "express";
const router = express.Router();
import Buys from "../models/buys.js";
import Basket from "../models/basket.js";
import Products from "../models/products.js";

//show the view of the buys
router.get("/buys", async (req, res) => {
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
	res.render("/buys", { buys });
});

//to deliver a purchase
router.get("/deliveredbuys/:id", async (req, res) => {
	const id = req.params.id;
	try {
		await Buys.findByIdAndUpdate(id, { delivered: true });
	} catch (error) {
		console.log(error);
	}
	res.redirect("/buys");
});

router.post("/buy", async (req, res) => {
	const basketId = req.body.basketId;
	const basket = await Basket.findById(basketId);
	for (let i = 0; i < basket.product.length; i++) {
		await Products.findByIdAndUpdate(basket.product[i]._id, {
			$inc: { amount: -1, sales: +1 },
		});
	}
	const newBuy = new Buys({
		basket,
		ueb,
		street,
		number,
		city,
		country,
		delivered,
	});
	await newBuy.save();
	res.json({ newBuy });
});

router.get("/bestsellers", async (req, res) => {
	const bestsellers = await Products.find().sort({ sales: -1 }).limit(10);
	res.json({ bestsellers });
});
