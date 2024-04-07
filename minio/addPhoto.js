import minioClient from "../file.js";


const addPhotoMinio = (fotos, tienda, producto) => {
    return fotos.map((image) => {
        const imagePath = `${tienda}/${producto}/${image.originalname}`;
        const imageBuffer = image.buffer;
        const imageType = image.mimetype;
        return new Promise((resolve, reject) => {
            minioClient.putObject(
                "propaganda",
                imagePath,
                imageBuffer,
                imageType,
                function (err, etag) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(imagePath);
                    }
                },
            );
        });
    });
}

export default addPhotoMinio;