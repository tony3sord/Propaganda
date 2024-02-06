const { Client } = await import("minio");
import fs from "fs";

const minioClient = new Client({
	endPoint: "localhost",
	port: 9000,
	useSSL: false,
	accessKey: "minioadmin",
	secretKey: "minioadmin",
});

/* Para listar los buckets que tengo */
async function listBuckets() {
	try {
		const buckets = await minioClient.listBuckets();
		console.log(buckets);
	} catch (error) {
		console.error("Error listing buckets:", error);
		throw error; // Puedes manejar el error según tus necesidades
	}
}

minioClient.fPutObject(
	"nuevo",
	"prueba12.png",
	"D:/Trabajos/Con Node/20.10.0/Propaganda y Eventos/public/images/1685309905255.png",
	{},
	function (err, etag) {
		if (err) return console.log(err);
		console.log("File uploaded successfully.");
	},
);

// const bucketName = "testing-tony";
// const objectName = "prueba10.png";

// // Descargar archivo a disco
// minioClient.getObject(bucketName, objectName, function (err, stream) {
// 	if (err) return console.log(err);

// 	stream.pipe(fs.createWriteStream("foto-descargada.jpg"));

// 	stream.on("error", function (err) {
// 		return console.log(err);
// 	});

// 	stream.on("end", function () {
// 		console.log("File successfully downloaded");
// 	});
// });

export { minioClient };
