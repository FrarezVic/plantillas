const fs = require('fs');
const path = require('path');
const mainPath = require('./mainPath');

const obtenerPlantillasInstaladas = () => {

    let resultado = {};
    let path_templates = path.join(mainPath(), 'templates');

    fs.readdirSync(path_templates).forEach(item => {
        try {
            let path_folder = path.join(path_templates, item);

            if (fs.lstatSync(path_folder).isDirectory()) {
                let path_index = path.join(path_folder, 'index.js');
                let content = require(path_index);
                if( content.nombre && content.funcion && typeof content.funcion === 'function' ){
                    resultado[content.nombre] = content.funcion;
                }
            }
        } catch (err) {
        }
    });

    return resultado;
};

module.exports = obtenerPlantillasInstaladas;