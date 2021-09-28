var inquirer = require('inquirer');
const moment = require('moment');
const { generarTemplate, obtenerCarpetaActual, obtenerConfiguracion } = require('../../funciones');

const preguntar_por_atributos = async ( respuestas ) => {
    let atributos = [];

    console.log('----------- Para finalizar presiona ENTER sin ingresar el nombre -----------');

    for (let numero = 1; numero < 100; numero++) {
        console.log(`----------- Agregar atributo ${numero} -----------`);

        let respuestas = await inquirer.prompt([
            {
                name: 'nombre',
                message: `Nombre`,
                type: 'input',
            },
            {
                name: 'tipo',
                message: `Tipo`,
                type: 'list',
                choices: [
                    'string',
                    'number',
                    'bolean',
                    'object',
                    'array',
                ],
                when: (values) => {
                    return values.nombre;
                },
            },
            {
                name: 'requerido',
                message: 'Requerido',
                type: 'confirm',
                when: (values) => {
                    return values.nombre;
                },
            }
        ]);

        if (!respuestas.nombre) {
            break;
        }

        atributos.push(respuestas);
    }

    return atributos;
};

module.exports.nombre = 'Lambda CRUD';

module.exports.funcion = async () => {

    let configuracion = await obtenerConfiguracion();
    let respuestas = {};

    respuestas = {
        ...respuestas,
        ...await inquirer.prompt([
            {
                name: 'lambda_servicio',
                message: `Nombre del servicio`,
                type: 'input',
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
                name: 'dynamo_tabla',
                message: 'Nombre de la tabla',
                type: 'input',
            },
            {
                name: 'endpoint_crud',
                message: 'EndPoint',
                type: 'input',
                default: (values) => {
                    return `/${values.dynamo_tabla || ''}`.toLowerCase();
                },
            },
            {
                name: 'lambda_eods_enviar',
                message: 'Agregar configuración para enviar al EODS',
                type: 'confirm',
                default: false
            },
            {
                name: 'lambda_eods_event',
                message: 'Nombre del evento a enviar',
                type: 'input',
                when: (values) => {
                    return values.lambda_eods_enviar;
                }
            },
            {
                name: 'habilitar_assume_role',
                message: 'Agregar invocación de lambdas externas',
                type: 'confirm',
                default: false
            },
            {
                name: 'agregar_atributos',
                message: '¿Agregar atributos?',
                type: 'confirm',
                default: true
            }
        ])
    };

    // preguntar por los atributos
    respuestas.atributos = respuestas.agregar_atributos ? await preguntar_por_atributos(respuestas) : [];

    // agregar los datos del usuario
    respuestas.usuario_nombre = configuracion.nombre;
    respuestas.usuario_email = configuracion.email;
    respuestas.fecha = moment().format('DD/MM/YYYY');

    await generarTemplate('/lambda_crud/template/', respuestas);
}