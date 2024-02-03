import mongoose from "mongoose";

const uebSchema = new mongoose.Schema({
	province:
		"Pinar del Río" |
		"Artemisa" |
		"Mayabeque" |
		"Matanzas" |
		"Cienfuegos" |
		"Villa Clara" |
		"Sancti Spíritus" |
		"Ciego de Ávila" |
		"Camagüey" |
		"Las Tunas" |
		"Holguín" |
		"Granma" |
		"Santiago de Cuba" |
		"Guantánamo" |
		"Isla de la Juventud",
});

module.exports = mongoose.model("UEB", uebSchema);
