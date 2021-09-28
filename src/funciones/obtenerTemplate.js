const fs = require('fs');
const path = require('path');
const mainPath = require('./mainPath');

const escanearCarpeta = (carpeta) => {

    let fullPath = path.join(`${mainPath()}/templates/`, carpeta);
    let resultado = [];

    fs.readdirSync(fullPath).forEach(item => {

        // generar el path completo
        let fullsubpath = path.join(fullPath, item);

        // si es una carpeta se escanea
        if( fs.lstatSync(fullsubpath).isDirectory() ){
            escanearCarpeta(`${carpeta}/${item}`).forEach(item2 => {
                resultado.push(`${item || '----'}/${item2}`);
            });
        }else{
            resultado.push(item);
        }
    });

    return resultado;
};

module.exports = escanearCarpeta;