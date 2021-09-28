'use strict';
const eliminaDynamo = require('../dao/elimina');
const headers = {
    "Access-Control-Allow-Origin": "*"
};

module.exports.eliminar = async (event) => {
    try {
        console.log('Request:' + JSON.stringify(event));

        let respuesta = await eliminaDynamo(process.env.DYNAMODB_TABLE, 'id', event.pathParameters.id);

        console.log(JSON.stringify(respuesta));

        return {
            statusCode: 200,
          	headers: headers,
            body: JSON.stringify(respuesta),
        };
    } catch (e) {
        console.log('Error en handler: ' + JSON.stringify(e));
        console.log('Mensaje de error: ' + e.message);
        let error = e.body || e;

        return {
            statusCode: e.statusCode || 500,
          	headers: headers,
            body: JSON.stringify(error)
        }
    }
};
