const axios = require('axios');
var fs = require('fs');

// interceptor para manejo de respuestas
axios.interceptors.response.use(function (response) {
    let respuesta = {};
    respuesta.statusCode = response.status;
    respuesta.body = response.data;
    return respuesta;
}, function (error) {
    let respuestaError = {};
    if (error.response) {
        respuestaError.statusCode = error.response.status;
        respuestaError.body = error.response.data;
    } else {
        respuestaError.statusCode = 500;
        respuestaError.body = { error: error.message };
    }
    return Promise.reject(respuestaError);
});

module.exports = async (req, token, endpoint) => {
    let error = false;
    try {
        let config = JSON.parse(fs.readFileSync("./recursos/constantes.json")).api;

        config.url = endpoint;
        config.data = req;
        if( token ){
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request: ', JSON.stringify(config));

        let respuesta = await axios(config).then(res => {
            console.log('Response: ', res);
            return res;
        }).catch(err => {
            console.log('Response Error: ' + JSON.stringify(err));
            error = true;
            return err;
        });
        return error ? Promise.reject(respuesta) : Promise.resolve(respuesta);
    } catch (err) {
        console.log('Error al consumir servicio: ' + JSON.stringify(err));
        return Promise.reject({
            statusCode: 500,
            body: { error: err.message }
        });
    }
};