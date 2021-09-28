const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: "us-east-1" });

function respuesta(statusCode, cuerpo) {
    return {
        statusCode: statusCode,
        body: JSON.parse(cuerpo)
    }
}

module.exports = async (functionName, data) => {
    let payload = JSON.stringify(data);
    let params = {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: payload
    };
    console.log("Request Lambda " + functionName + "con parametros: " + JSON.stringify(payload));
    let resultado = await lambda.invoke(params).promise().then((data) => {
        let response = JSON.parse(data.Payload);
        console.log("Response Lambda " + functionName);
        console.log(JSON.stringify(response));
        return respuesta(response.statusCode, response.body);
    }).catch(function (reason) {
        console.log('Razón de error al invocar lambda: ', reason);
        return respuesta(reason.statusCode || 500, reason);
    });

    return Promise.resolve(resultado);
};
