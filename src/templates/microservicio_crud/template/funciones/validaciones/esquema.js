var logger = require("../utilerias/logger");
var Ajv = require('ajv');
var esquemas_generales = require("../../configuraciones/esquemas/generales")
var {HTTP_CODIGOS } = require('../../configuraciones/codigos_http');

async function validar_parametros_general (body_json, esquema) {
    let detalles = [];
    let ajv = new Ajv({ allErrors: true });
    let valido = ajv.validate(esquemas_generales[esquema], body_json);
   
    if(!valido) {
        ajv.errors.forEach(function(error){
            logger.info('Error en schema: ' + JSON.stringify(error));
            detalles.push(error.dataPath + " " +error.message);
        });
    }
    return valido ? body_json : { body_json, error: detalles }
}

exports.validar_parametros = async function (body_json, dato) {
    logger.info('Validación de esquema');
    var respuesta = {
        body: "",
        header: "",
    };
    if(dato.header.requerido){
        respuesta.header = await validar_parametros_general(body_json.headers, dato.header.valor);
        if(respuesta.header.error){
            return {codigo: HTTP_CODIGOS._400.contexto._010.codigo, mensaje:HTTP_CODIGOS._400.contexto._010.mensaje, detalle: respuesta.header}
        }
    }
    if(dato.body.requerido){
        respuesta.body = await validar_parametros_general(body_json.body, dato.body.valor);
        if(respuesta.body.error){
            return {codigo: HTTP_CODIGOS._400.contexto._011.codigo, mensaje:HTTP_CODIGOS._400.contexto._011.mensaje, detalle: respuesta.body}
        }
    }
    return respuesta;
}


exports.validar_parametros_header = async function (body_json, dato) {
    logger.info('Validación de esquema');
    var respuesta = {
        body: "",
        header: "",
    };
    if(dato.header.requerido){
        respuesta.header = await validar_parametros_general(body_json.headers, dato.header.valor);
        if(respuesta.header.error){
            return {codigo: HTTP_CODIGOS._400.contexto._010.codigo, mensaje:HTTP_CODIGOS._400.contexto._010.mensaje, detalle: respuesta.header}
        }
    }
    
        return respuesta;    
}

