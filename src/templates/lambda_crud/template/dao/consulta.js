const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (nombreTabla, nombreLlave, valorLlave) => {

    console.log("Consulta en tabla " + nombreTabla);
    let llave = {};
    llave[nombreLlave] = valorLlave;
    const params = {
        TableName: nombreTabla,
        Key: llave
    };

    return await new Promise((resolve, reject) => {
        dynamoDB.get(params, (error, result) => {
            if (error) {
                console.log('Error en consulta: ' + JSON.stringify(error));
                reject(error);
                return;
            }
            if (result.Item) {
                resolve(result.Item);
                return;
            } else {
                reject({
                    statusCode: 404,
                    body: {
                        mensaje: 'No se encontraron coincidencias de búsqueda'
                    }
                });
                return;
            }
        });
    });
};