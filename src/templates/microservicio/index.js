var inquirer = require('inquirer');
const moment = require('moment');
const chalk = require('chalk');
const { generarTemplate, obtenerCarpetaActual, obtenerConfiguracion } = require('../../funciones');

module.exports.nombre = 'Microservicio';

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
                validate: (value) => {
                    if (!value) {
                        return 'El nombre es requerido'
                    }
                    return true;
                },
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
                message: 'Endpoint principal',
                type: 'list',
                choices: [
                    'banco',
                    'prendario',
                    'general',
                    'otro...',
                ],
                default: 'banco',
                filter: (value) => {
                    return value.startsWith('/') ? value : `/${value}`;
                }
            },
            {
                name: 'micro_url_principal_personalizado',
                message: `Endpoint principal`,
                type: 'input',
                validate: (value) => {
                    if (value.toString().includes('_')) {
                        return 'La url no debe tener guiones medios';
                    }
                    return true;
                },
                filter: (value) => {
                    return value.startsWith('/') ? value : `/${value}`;
                },
                when: (values) => {
                    return values.micro_url_principal === '/otro...' ? true : false;
                }
            },
            {
                name: 'micro_url_secundaria',
                message: `Endpoint secundario`,
                type: 'input',
                validate: (value) => {
                    if (value.toString().includes('_')) {
                        return 'La url no debe tener guiones medios';
                    }
                    return true;
                },
                filter: (value) => {
                    return value.startsWith('/') ? value : `/${value}`;
                }
            },
            {
                name: 'micro_metodo',
                message: 'Metodo de consumo',
                type: 'list',
                choices: [
                    'post',
                    'get',
                    'put',
                    'delete',
                ],
                default: 'post',
            },
            {
                name: 'micro_conexion',
                message: 'Conexion a la base de datos',
                type: 'list',
                choices: [
                    'psql',
                    'mssql',
                    'ambas',
                ],
                default: 'post',
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
                default: 'BAN-CIRCULAR11',
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
    };

    respuestas.nombre_config = (respuestas.nombre || '').replace(new RegExp('_', 'g'), '-');
    respuestas.micro_url_principal = respuestas.micro_url_principal_personalizado || respuestas.micro_url_principal;
    respuestas.micro_acl = respuestas.micro_acl_personalizado || respuestas.micro_acl;
    respuestas.volumen = respuestas.micro_namespace.split('-')[0];

    await generarTemplate('/microservicio/template', respuestas);
}