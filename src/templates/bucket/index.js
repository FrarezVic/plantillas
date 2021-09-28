var inquirer = require('inquirer');
const moment = require('moment');
const { generarTemplate, obtenerConfiguracion } = require('../../funciones');

module.exports.nombre = 'Bucket';

module.exports.funcion = async () => {

    let configuracion = await obtenerConfiguracion();
    let respuestas = {
        usuario_nombre: configuracion.nombre,
        usuario_email: configuracion.email,
        fecha: moment().format('DD/MM/YYYY'),
        paquete: '',
        tipo_acceso: '',
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
                name: 'tipo_acceso',
                message: `Tipo de acceso`,
                type: 'list',
                choices: [
                    'Private',
                    'PublicRead',
                    'PublicReadWrite',
                    // 'AuthenticatedRead',
                    // 'LogDeliveryWrite',
                    // 'BucketOwnerRead',
                    // 'BucketOwnerFullControl',
                ],
                default: 'Private'
            }
        ])
    };

    await generarTemplate('/bucket/template/', respuestas);
}