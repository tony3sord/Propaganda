# Propaganda-y-Eventos
Proyecto de Empresa para la tesis 

# Minio
Para usar minio se debe crear un bucket llamado "propaganda" usando la funcion de minio createBucket presente aqui debajo, o lo puede hacer por la interface de minio
createBucket("propaganda");
const createBucket = (bucketName) => {
    return new Promise((resolve, reject) => {
        minioClient.bucketExists(bucketName, (err, exists) => {
            if (err) {
                reject(err);
            } else if (!exists) {
                minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`Bucket ${bucketName} created successfully.`);
                    }
                });
            } else {
                resolve(`Bucket ${bucketName} already exists.`);
            }
        });
    });
}
Cada tienda tendra su carpeta de productos dentro del bucket propaganda, cada carpeta tendra como nombre el id de la tienda, y cada producto tendra asignado una carpeta, donde dentro de la carpeta estaran sus fotos.

# Node 
Se deberia usar Node v18> para el mejor funcionamiento


# Mongo DB
La version de mongo db usasa es la 7.0.6

