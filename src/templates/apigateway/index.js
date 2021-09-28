var inquirer = require('inquirer');
const moment = require('moment');
const { generarTemplate, capitalize, obtenerConfiguracion } = require('../../funciones');

const generarPaths = (endpoint) => {
    let partes = endpoint.toLowerCase().split('/');
    let resultado = [];

    let currentPath = `v1`;
    let ParentId = 'ApiGatewayResourceV1';

    partes.forEach(part => {
        if (part && part !== 'v1' ) {
            currentPath += `/${part}`;
            resultado.push({
                path: currentPath,
                name: `${ParentId}${capitalize(part)}`,
                ParentId: ParentId,
                PathPart: part,
            });

            ParentId += capitalize(part)
        }
    })

    return resultado;
};

module.exports.nombre = 'ApiGateway';

module.exports.funcion = async () => {

    let configuracion = await obtenerConfiguracion();
    let respuestas = {
        usuario_nombre: configuracion.nombre,
        usuario_email: configuracion.email,
        fecha: moment().format('DD/MM/YYYY'),
        paquete: '',
        descripcion: '',
        endpoint: '',
        authorizer: false,
        lambda_authorizer: '',
        paths: [],
    };

    respuestas = {
        ...respuestas,
        ...await inquirer.prompt([
            {
                name: 'paquete',
                message: `Nombre del paquete`,
                type: 'input',
                askAnswered: true,
                validate: (value) => {
                    return value ? true : 'paquete no puede ser nulo';
                },
            },
            {
                name: 'descripcion',
                message: 'Descripción',
                default: 'N/A',
                type: 'input',
            },
            {
                name: 'agregar_endpoint',
                message: '¿Agregar endpoint?',
                type: 'confirm',
                default: true
            },
            {
                name: 'endpoint',
                message: '¿Cual es el endpoint?',
                type: 'input',
                when: (values) => values.agregar_endpoint,
            },
            {
                name: 'authorizer',
                message: '¿Habilitar autorizer?',
                type: 'confirm',
                default: false
            },
            {
                name: 'lambda_authorizer',
                message: 'Lambda authorizer',
                type: 'input',
                when: (values) => values.authorizer,
            },
        ])
    };

    respuestas.path_lista = generarPaths(respuestas.endpoint);
    respuestas.path_final = respuestas.path_lista[respuestas.path_lista.length - 1] || null;

    await generarTemplate('/apigateway/template/', respuestas);
}