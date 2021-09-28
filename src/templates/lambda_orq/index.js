var inquirer = require('inquirer');
const moment = require('moment');
const { generarTemplate, obtenerCarpetaActual, obtenerConfiguracion } = require('../../funciones');

module.exports.nombre = 'Lambda ORQ';

module.exports.funcion = async () => {

    let configuracion = await obtenerConfiguracion();
    let respuestas = {
        usuario_nombre: configuracion.nombre,
        usuario_email: configuracion.email,
        fecha: moment().format('DD/MM/YYYY'),
        lambda_servicio: '',
        lambda_paquete: '',
        habilitar_apigateway: '',
        lambda_endpoint: '',
        lambda_method: '',
        habilitar_assume_role: '',
        habilitar_secret_manager: '',
    };

    respuestas = {
        ...respuestas,
        ...await inquirer.prompt([
            {
                name: 'lambda_servicio',
                message: `Nombre del servicio`,
                type: 'input',
                default: obtenerCarpetaActual(),
                askAnswered: true,
                validate: (value) => {
                    if( !value ){
                        return 'El nombre del servicio no puede ser nulo';
                    }

                    if( (value).toString().length > 39 ){
                        return `El nombre del servicio debe ser menor a 39 caracteres`;
                    }

                    return true;
                }
            },
            {
                name: 'lambda_paquete',
                message: 'Nombre del paquete',
                type: 'input',
            },
            {
                name: 'habilitar_apigateway',
                message: 'Agregar Endpoint',
                type: 'confirm',
                default: false
            },
            {
                name: 'lambda_endpoint',
                message: 'EndPoint',
                type: 'input',
                when: (values) => {
                    return values.habilitar_apigateway;
                },
                filter: (value) => {
                    return value;
                }
            },
            {
                name: 'lambda_method',
                message: 'Metodo para consumir',
                type: 'list',
                choices: ['get', 'post', 'put', 'delete'],
                when: (values) => {
                    return values.habilitar_apigateway;
                },
                default: 'post'
            },
            {
                name: 'habilitar_assume_role',
                message: 'Agregar configuración para comsumir lambdas de otro sandbox(Assume Role)',
                type: 'confirm',
                default: false
            },
            {
                name: 'habilitar_secret_manager',
                message: 'Agregar configuración para secret manager',
                type: 'confirm',
                default: false
            },
        ])
    };

    await generarTemplate('/lambda_orq/template/', respuestas);
}