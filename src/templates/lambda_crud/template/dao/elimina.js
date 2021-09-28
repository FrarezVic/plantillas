const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (nombreTabla, nombreLlave, valorLlave) => {

    console.log("Eliminación de elemento en tabla " + nombreTabla);
    let llave = {};
    llave[nombreLlave] = valorLlave;
    const params = {
        TableName: nombreTabla,
        Key: llave,
    };
    return await new Promise((resolve, reject) => {
        dynamoDB.delete(params, (error) => {
            if (error) {
                console.log('Error al eliminar elemento: ' + JSON.stringify(error));
                reject(error);
                return;
            }
            resolve({
                mensaje:'Eliminación exitosa'
            });
            return;
        });
    });
};