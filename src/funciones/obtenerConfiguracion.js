const gitUserInfo = require('git-user-info');
const userName = require('git-user-name');
const userEmail = require('git-user-email');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer')
const mainPath = require('./mainPath');


module.exports = () => {
    return new Promise( async (resolve, reject) => {

        let carpeta = path.join(mainPath(), 'configuracion');
        let archivo = path.join(carpeta, 'usuario.json');

        // validar si existe la carpeta, o crearla
        if (!fs.existsSync(carpeta)) {
            await fs.mkdirSync(carpeta, { recursive: true });
        }

        // validar si existe el archivo, o crearlo
        if (!fs.existsSync(archivo)) {

            console.log(chalk.blue('Para comenzar, agrega tus datos, se utilizaran para agregar a los README.md'));

            let respuestas = await inquirer.prompt([
                {
                    name: 'nombre',
                    message: 'Nombre',
                    type: 'input',
                },
                {
                    name: 'email',
                    message: 'Email',
                    type: 'input',
                }
            ]);

            await fs.writeFileSync(archivo, JSON.stringify(respuestas, null, 4));
        }

        return resolve(require(archivo));
    });
}