import minioClient from "../file.js";

const createFolderInBucket = (bucketName, folderName) => {
    const objectName = `${folderName}/dummyObject`;

    return new Promise((resolve, reject) => {
        minioClient.putObject(bucketName, objectName, 'dummyContent', 'text/plain', (err, etag) => {
            if (err) {
                reject(err);
            } else {
                resolve(`Folder ${folderName} created successfully in bucket ${bucketName}.`);
            }
        });
    });
}

export default createFolderInBucket;