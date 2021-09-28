var fs = require('fs');
const Axios = require('axios');

const controlarRespuesta = (respuesta, resolve, reject, reemplazarError) => {
    if (respuesta.data.codigo === '000') {
        console.log('Control respuesta:', respuesta.data);
        resolve(respuesta.data);
    } else if (respuesta.data && respuesta.data.errors) {
        reject({
            isCustomError: true,
            reemplazarError: reemplazarError,
            errores: respuesta.data.errors.map(item => item.shortDescription),
        });
    } else {
        throw new Error({ message: 'No se ha podido analizar la respuesta' });
    }
};

module.exports = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let archivo = JSON.parse(fs.readFileSync("configuraciones/microservicios.json"));
            let currentUnixTime = ~~(Date.now() / 1000);
            let uuid_id = generateUUID();
            let uuid_uuid = generateUUID();
            let uuid_process_instance_id = generateUUID();
            let mensaje = {
                id: uuid_id,
                uuid: uuid_uuid,
                app_id: data.app_id ? data.app_id : 'BBVA_TPV',
                timestamp: data.timestamp ? data.timestamp : currentUnixTime,
                event_type: data.event_type ? data.event_type : "TPV_TERMINALES",
                process_instance_id: data.process_instance_id ? data.process_instance_id : uuid_process_instance_id,
                message: data,
            };

            let mensajeEndPoint = archivo.mensajeEODS;
            mensajeEndPoint.data = mensaje;

            let respuesta = await Axios(mensajeEndPoint);
            controlarRespuesta(respuesta, resolve, reject);
        } catch (error) {
            console.log('Error en generaMensajeODS: ' + error.message);
            reject(error);
        }
    });
};