import minioClient from "../file.js";
import os from "os";

const destination = "";

function getPhoto(bucket, file) {
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(bucket, file, (err, presignedUrl) => {
      if (err) {
        return reject(err);
      }
      const urlWithIp = presignedUrl.replace(
        "http://localhost:9000/",
        "https://0m9fgs4l-9000.usw3.devtunnels.ms/",
      );
      resolve(urlWithIp);
    });
  });
}

function getServerIp() {
  const networkInterfaces = os.networkInterfaces();

  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.internal !== false) {
        continue;
      }
      if (net.family === "IPv4") {
        return net.address;
      }
    }
  }

  return "localhost";
}

export default getPhoto;
