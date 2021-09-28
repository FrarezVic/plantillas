var inquirer = require('inquirer');
const moment = require('moment');
const chalk = require('chalk');
const { generarTemplate, obtenerCarpetaActual, obtenerConfiguracion } = require('../../funciones');

const preguntar_por_atributos = async () => {
    let atributos = [];

    let tipos_de_atributos = {
        'STRING': {
            tipo_schema: 'string',
        },
        'INTEGER': {
            tipo_schema: 'number',
        },
        'DECIMAL': {
            tipo_schema: 'number',
        },
        'FLOAT': {
            tipo_schema: 'number',
        },
        'DATE': {
            tipo_schema: 'string',
        },
        'DATEONLY': {
            tipo_schema: 'string',
        },
        'JSONB': {
            tipo_schema: 'object',
        }
    };

    console.log('----------- Para finalizar presiona ENTER sin ingresar el nombre -----------');

    for (let numero = 1; numero < 100; numero++) {
        console.log(`----------- Agregar atributo ${numero} -----------`);

        let respuestas = await inquirer.prompt([
            {
                name: 'nombre',
                message: `Nombre`,
                type: 'input',
                filter: (value) => {
                    return value.toLowerCase().replace(/\s/g, '');
                }
            },
            {
                name: 'tipo',
                message: `Tipo`,
                type: 'list',
                choices: Object.keys(tipos_de_atributos),
                when: (values) => {
                    return values.nombre;
                },
            },
            {
                name: 'cantidad_enteros',
                message: `Número de Enteros`,
                type: 'number',
                when: (values) => {
                    return values.nombre && values.tipo === 'DECIMAL';
                },
            },
            {
                name: 'cantidad_decimales',
                message: `Número de decimales`,
                type: 'number',
                when: (values) => {
                    return values.nombre && values.tipo === 'DECIMAL';
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

        respuestas.tipo_schema = tipos_de_atributos[respuestas.tipo].tipo_schema;

        atributos.push(respuestas);
    }

    return atributos;
};

module.exports.nombre = 'Microservicio CRUD';

module.exports.funcion = async () => {

    let configuracion = await obtenerConfiguracion();
    let respuestas = {
        usuario_nombre: configuracion.nombre,
        usuario_email: configuracion.email,
        fecha: moment().format('DD-MM-YYYY'),
    };

    respuestas = {
        ...respuestas,
        ...await inquirer.prompt([
            {
                name: 'micro_nombre',
                message: 'Nombre del microservicio',
                type: 'input',
                default: obtenerCarpetaActual(),
                // validate: (value) => {
                //     if (!value) {
                //         return 'El nombre es requerido'
                //     }
                //     return true;
                // },
                filter: (value) => {
                    return value.replace(/\s/g, '');
                }
            },
            {
                name: 'micro_descripcion',
                message: `Descripción del microservicio`,
                type: 'input',
            },
            {
                name: 'micro_url_principal',
                message: `Endpoint principal`,
                type: 'input',
                validate: (value) => {
                    if (value.toString().includes('-')) {
                        return 'La url no debe tener guiones medios';
                    }
                    return true;
                },
                filter: (value) => {
                    return value.startsWith('/') ? value : `/${value}`;
                }
            },
            {
                name: 'micro_schema',
                message: `Nombre del schema`,
                type: 'input',
            },
            {
                name: 'micro_tabla',
                message: `Nombre de la tabla`,
                type: 'input',
            },
            {
                name: 'micro_primary_key',
                message: `Nombre del primary key`,
                type: 'input',
                default: 'id',
            },
            {
                name: 'agregar_atributos',
                message: '¿Agregar atributos adicionales al primary key?',
                type: 'confirm',
                default: true
            },
        ])
    };

    respuestas.atributos = respuestas.agregar_atributos ? await preguntar_por_atributos() : [];

    respuestas = {
        ...respuestas,
        ...await inquirer.prompt([
            {
                name: 'micro_eods_enviar',
                message: 'Enviar al EODS',
                type: 'confirm',
                default: false
            },
            {
                name: 'micro_namespace',
                message: 'Selecciona el Namespace',
                type: 'list',
                choices: [
                    'general-soporte-de-negocio',
                    'prendario-datos-de-referencia',
                    'banco-operacion-de-producto-cruzado',
                ],
                default: 'general-soporte-de-negocio',
            },
            {
                name: 'micro_acl',
                message: 'Selecciona el ACL',
                type: 'list',
                choices: [
                    'BAN-CIRCULAR11',
                    'FRD-WANASHOP',
                    'PRENDARIO',
                    'ROBIN-PRENDARIO',
                    'BANCO-SPEI-NR',
                    'PREND-MUNDO_AUTO',
                    'ROBOIDENT',
                    'OTRO...',
                ],
                default: 0,
            },
            {
                name: 'micro_acl_personalizado',
                message: `¿Cual es el nombre ACL?`,
                type: 'input',
                default: 'id',
                when: (values) => {
                    return values.micro_acl === 'OTRO...' ? true : false;
                }
            },
        ])
    }

    respuestas.nombre_config = (respuestas.nombre || '').replace(new RegExp('_', 'g'), '-');
    respuestas.micro_acl = respuestas.micro_acl_personalizado || respuestas.micro_acl;
    respuestas.volumen = respuestas.micro_namespace.split('-')[0];

    await generarTemplate('/microservicio_crud/template', respuestas);
}