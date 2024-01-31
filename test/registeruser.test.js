import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

describe("POST /product/addproduct", () => {
	it("Se añadió el producto", async () => {
		const res = await request(app)
			.post("/product/addproduct")
			.send({
				name: "Test Product",
				price: 1000,
				description: "This Product is for testing",
				image: [
					"https://www.google.com/url?sa=i&url=https%3A%2F%2Fhttps://www.google.com/url?sa=i&url=https%3A%2F%2Fethic.es%2F2023%2F03%2Fel-enigma-de-la-imagen%2F&psig=AOvVaw3TMwjdc_ugyltwikEt8XeD&ust=1706634211859000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJCDs4CKg4QDFQAAAAAdAAAAABAEwww.is",
					"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.es%2Fvector-premium%2Flindo-koala-pensar-algo-dibujos-animados-vector-icono-ilustracion-animal-naturaleza-icono-concepto-aislado_29677655.htm&psig=AOvVaw3SNXOD7MpQUO5VavnAK7IE&ust=1706739834329000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjr6LyThoQDFQAAAAAdAAAAABAE",
				],
				category: "Category Testing",
				amount: 10,
			});
		expect(res.statusCode).to.equal(200);
		expect(res.body).to.have.property("product");
	});
});
