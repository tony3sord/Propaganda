import minioClient from "../file.js";

function getPhoto(bucket, file) {
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucket, file, function (err, dataStream) {
      if (err) {
        return reject(err);
      }
      let data = [];
      dataStream.on("data", function (chunk) {
        data.push(chunk);
      });
      dataStream.on("end", function () {
        let blob = new Blob(data);
        let url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
  });
}
export default getPhoto;
