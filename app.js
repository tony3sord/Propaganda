import express from "express";
import mongoose from "mongoose";
const app = express();
import session from "express-session";

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

import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

//For server https
const secret_https = process.env.SECRET_KEY_HTTPS;
const PORT = parseInt(process.env.PORT);
const bd_connetion = process.env.BD_CONNETION;

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
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/basket", basketRoutes);
app.use("/shop", shopRoutes);
app.use("/buys", buysRoutes);
app.use("/contact", contactRoutes);
app.use("/about", aboutRoutes);
app.use("/help", helpRoutes);

main().catch((err) => console.log(err));
async function main() {
	try {
		mongoose.connect(`mongodb://127.0.0.1/${bd_connetion}`);
		console.log("MongoDB is Online,now");
	} catch (error) {
		console.error("Error to the connect with MongoDB:", error);
	}
}

//Para servir la api a react
// app.use(express.static(path.join(__dirname, "build")));

// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.listen(PORT, () => {
	console.log(`Server Active, port: ${PORT}`);
});

export default app;
