import minioClient from "../file.js";

function removeSpaces(originalname) {
  return originalname.replace(/\s/g, "");
}

function limpiarNombre(nombre) {
  return nombre.replace(/[^a-zA-Z0-9.]/g, "");
}

const addPhotoMinio = (fotos, tienda, producto) => {
  return fotos.map((image) => {
    const nombre = removeSpaces(image.originalname);
    const imagePath = `${tienda}/${producto}/${Date.now().toString()}${limpiarNombre(
      nombre,
    )}`;
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
};

export default addPhotoMinio;
