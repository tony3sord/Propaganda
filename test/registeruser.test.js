import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

describe("Facebook Auth", function () {
	it("should redirect to Facebook", function (done) {
		request(app)
			.get("/user/auth/facebook/callback") // Ruta de autenticación de Facebook
			.expect(302) // Espera una redirección
			.end(function (err, res) {
				if (res.headers.location) {
					expect(res.headers.location).to.include(
						"https://www.facebook.com/v3.2/dialog/oauth",
					);
				}
				done(err);
			});
	});

	// Añade más pruebas según sea necesario
});
