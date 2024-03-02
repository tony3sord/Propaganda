const { Client } = await import("minio");

const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const endPoint = process.env.MINIO_END_POINT;
const port = process.env.MINIO_PORT;

const minioClient = new Client({
	endPoint: endPoint,
	port: port,
	useSSL: false,
	accessKey: accessKey,
	secretKey: secretKey,
});

// /* Para listar los buckets que tengo */
// async function listBuckets() {
// 	try {
// 		const buckets = await minioClient.listBuckets();
// 		console.log(buckets);
// 	} catch (error) {
// 		console.error("Error listing buckets:", error);
// 		throw error; // Puedes manejar el error según tus necesidades
// 	}
// }

// minioClient.fPutObject(
// 	"nuevo",
// 	"prueba12.png",
// 	"D:/Trabajos/Con Node/20.10.0/Propaganda y Eventos/public/images/1685309905255.png",
// 	{},
// 	function (err, etag) {
// 		if (err) return console.log(err);
// 		console.log("File uploaded successfully.");
// 	},
// );

export default minioClient;
