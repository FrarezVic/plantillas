'use strict';
const listaDynamo = require('../dao/lista');
const headers = {
    "Access-Control-Allow-Origin": "*"
};

module.exports.lista = async (event) => {
    try {

        console.log('Request:' + JSON.stringify(event));

        let respuesta = await listaDynamo(process.env.DYNAMODB_TABLE, event.multiValueQueryStringParameters);

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