const chalk = require('chalk');
var inquirer = require('inquirer');
const obtenerConfiguracion = require('./funciones/obtenerConfiguracion');
const obtenerPlantillasInstaladas = require('./funciones/obtenerPlantillasInstaladas');

module.exports = async (params) => {
    try {

        let configuracion = await obtenerConfiguracion();
        let plantillas_instaladas = obtenerPlantillasInstaladas();

        let respuestas = {
            ...await inquirer.prompt([
                {
                    name: 'plantilla',
                    message: 'Selecciona la plantilla que deseas generar',
                    type: 'list',
                    choices: Object.keys(plantillas_instaladas),
                    // default: 'ai',
                }
            ])
        };

        plantillas_instaladas[respuestas.plantilla]();
    } catch (error) {
        console.log(chalk.red(`Ha ocurrido un error al generar la plantilla: ${error.message}`));
    }
}