import { exec } from "child_process";
import os from "os";

const isWindows = os.platform() === "win32";
const minioCommand = isWindows
  ? "minio server C:/minio --console-address :9001"
  : "minio server ~/minio --console-address :9001";

exec(minioCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  console.log(`Minio en línea: ${stderr}`);
});
