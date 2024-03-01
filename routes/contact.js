import express from "express";
const router = express.Router();
import Contact from "../models/contact.js";

router.get("/contact/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		const contact = await Contact.findOne({ shop });
		res.status(200).json(contact);
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.post("/addcontact/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { gmail, phone, facebook, messenger } = req.body;
	try {
		const newContact = new Contact({
			shop,
			gmail,
			phone,
			facebook,
			messenger,
		});
		await newContact.save();
		res.status(200).send("Contact added successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.patch("/editcontact/:shop", async (req, res) => {
	const shop = req.params.shop;
	const { gmail, phone, facebook, messenger } = req.body;
	try {
		await Contact.findOneAndUpdate(
			{ shop },
			{ gmail, phone, facebook, messenger },
		);
		res.status(200).send("Contact edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});

router.delete("/removecontact/:shop", async (req, res) => {
	const shop = req.params.shop;
	try {
		await Contact.findOneAndDelete({ shop });
		res.status(200).send("Contact deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Server error");
	}
});
