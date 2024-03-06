const { Client } = import("minio");

const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const endPoint = process.env.MINIO_END_POINT;
const port = parseInt(process.env.MINIO_PORT);

const minioClient = new Client({
	endPoint: endPoint,
	port: port,
	useSSL: false,
	accessKey: accessKey,
	secretKey: secretKey,
});

export default minioClient;
