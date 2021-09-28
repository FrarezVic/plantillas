const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (nombreTabla, nombreLlave, valorLlave, elementos) => {

    console.log("Actualiza tabla " + nombreTabla);
    let llave = {};
    llave[nombreLlave] = valorLlave;
    let expresionAtributosValores = {};
    var expresionActualizacion = '';
    let conditionExpression = "attribute_exists(" + nombreLlave + ")";

    elementos.fecha_modificacion = new Date().toLocaleString("es-ES", {timeZone: "America/Mexico_City"});
    elementos.fecha_modificacion_timestamp = Math.round((new Date()).getTime() / 1000);

    for (var prop in elementos) {
        if (elementos[prop] || elementos[prop] === 0) {
            let nombreAttributo = ':' + prop;
            expresionAtributosValores[nombreAttributo] = elementos[prop];
            expresionActualizacion += prop + ' = ' + nombreAttributo + ', ';
        }
    }
    console.log(expresionAtributosValores);
    expresionActualizacion = 'SET ' + expresionActualizacion.slice(0, expresionActualizacion.length - 2);
    console.log(expresionActualizacion);
    const params = {
        TableName: nombreTabla,
        Key: llave,
        ConditionExpression: conditionExpression,
        ExpressionAttributeValues: expresionAtributosValores,
        UpdateExpression: expresionActualizacion,
        ReturnValues: 'ALL_NEW',
    };
    return await new Promise((resolve, reject) => {
        dynamoDB.update(params, (error, result) => {
            if (error) {
                console.log('Error en actualización: ' + JSON.stringify(error));
                if (error.code === 'ConditionalCheckFailedException') {
                    reject({
                        statusCode: 404,
                        body: {
                            mensaje: 'No se encontró el id para la actualización'
                        }
                    });
                    return;
                }
                reject(error);
                return;
            }

            resolve(result.Attributes);
        });
    });
};
