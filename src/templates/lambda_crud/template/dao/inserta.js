const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (nombreTabla, elementos) => {

    console.log("Inserta en tabla " + nombreTabla);

    elementos.fecha_registro = new Date().toLocaleString("es-ES", {timeZone: "America/Mexico_City"});
    elementos.fecha_registro_timestamp = Math.round((new Date()).getTime() / 1000);

    const params = {
        TableName: nombreTabla,
        Item: elementos,
    };
    return await new Promise((resolve, reject) => {
        dynamoDB.put(params, (error) => {
            if (error) {
                console.log('Error al insertar' + JSON.stringify(error));
                reject(error);
                return;
            } else {
                resolve(params.Item);
                return;
            }
        });
    });
};