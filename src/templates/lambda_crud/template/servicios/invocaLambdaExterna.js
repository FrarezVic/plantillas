const AWS = require('aws-sdk');

function respuesta(statusCode, cuerpo) {
    return {
        statusCode: statusCode,
        body: JSON.parse(cuerpo)
    }
}

module.exports = async (functionName, data) => {

    const sts = new AWS.STS({ region: 'us-east-1' });
    const stsParams = {
        RoleArn: process.env.ARN_ROL_EXTERNO,
        DurationSeconds: 3600,
        RoleSessionName: "NombreSesion"
    };

    const stsResults = await sts.assumeRole(stsParams).promise();

    const lambda = new AWS.Lambda({
        region: 'us-east-1',
        accessKeyId: stsResults.Credentials.AccessKeyId,
        secretAccessKey: stsResults.Credentials.SecretAccessKey,
        sessionToken: stsResults.Credentials.SessionToken
    });

    let payload = JSON.stringify(data);

    let params = {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: payload
    };

    console.log("Request Lambda " + functionName + "con parametros: " + payload);

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
