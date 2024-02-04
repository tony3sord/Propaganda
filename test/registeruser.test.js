import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

describe("POST /user/login", function () {
	it("Iniciar sesión con éxito", async function () {
		this.timeout(5000);
		const res = await request(app).post("/user/login").send({
			user: "ese",
			password: "password",
		});
		expect(res.statusCode).to.equal(200);
		expect(res.body).to.have.property("token");
	});
});
