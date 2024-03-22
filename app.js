import express from "express";
import mongoose from "mongoose";
const app = express();
import session from "express-session";
import cors from "cors";

app.use(cors());
//Import Routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import basketRoutes from "./routes/basket.js";
import shopRoutes from "./routes/shop.js";
import buysRoutes from "./routes/buys.js";
import contactRoutes from "./routes/contact.js";
import aboutRoutes from "./routes/about.js";
import helpRoutes from "./routes/help.js";
import promotionRoutes from "./routes/promotion.js";
import materialRoutes from "./routes/material.js";
import informationRoutes from "./routes/information.js";

import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

//For server https
const secret_https = process.env.SECRET_KEY_HTTPS;
const PORT = parseInt(process.env.PORT);
const bd_connetion = process.env.BD_CONNETION;
const HOST_MONGO = process.env.HOST_MONGO;

app.use(
	session({
		secret: secret_https,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: false,
		},
	}),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoutes);
app.use("/information", informationRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/basket", basketRoutes);
app.use("/shop", shopRoutes);
app.use("/buys", buysRoutes);
app.use("/contact", contactRoutes);
app.use("/about", aboutRoutes);
app.use("/help", helpRoutes);
app.use("/promotion", promotionRoutes);
app.use("/material", materialRoutes);


main().catch((err) => console.log(err));
async function main() {
	try {
		const a = await mongoose.connect(`mongodb://${HOST_MONGO}/${bd_connetion}`);
		if(a){
			console.log("MongoDB is Online,now");
		}else{
			console.log("MongoDB is Offline,now");
		}
	} catch (error) {
		console.error("Error to the connect with MongoDB:", error);
	}
}

app.listen(PORT, () => {
	console.log(`Server Active, port: ${PORT}`);
});

app.get("/", (req, res) => {
	res.send("Welcome to the API of the store");
});

export default app;
