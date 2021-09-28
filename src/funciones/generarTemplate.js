const makeDir = require('make-dir');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const ejs = require('ejs');
const mainPath = require('./mainPath');
const obtenerTemplate = require('./obtenerTemplate')

const copiarArchivo = (template, archivo, respuestas) => {
    return new Promise( async (resolve, reject) => {
        try {
            let originPath = path.join(mainPath(), `/templates/${template}/${archivo}`);

            if(!fs.lstatSync(originPath).isDirectory()){
                let content = fs.readFileSync(originPath, 'utf-8');
                let nuevo_nombre = archivo.replace('.ejs', '');
                let generar_archivo = true;

                if( respuestas.plantilla == 'Microservicio' || respuestas.plantilla == 'Microservicio CRUD' ){
                    // reemplazar las configuracion del despliege
                    nuevo_nombre = nuevo_nombre.replace('{micro_nombre}', `${respuestas.micro_nombre}`);

                    // console.log(nuevo_nombre);

                    // imprimir solo el archivo que se requiere para la conexion
                    if( respuestas.micro_conexion == 'mssql' && nuevo_nombre == 'funciones/consulta/consulta_psql.js'){
                        generar_archivo = false;
                    }else if( respuestas.micro_conexion == 'psql' && nuevo_nombre == 'funciones/consulta/consulta_mssql.js' ){
                        generar_archivo = false;
                    }
                }

                if( generar_archivo ){
                    // console.log(nuevo_nombre);
                    fs.writeFileSync(nuevo_nombre, ejs.render(content, respuestas, {}), 'utf8');
                }else{
                    console.log(nuevo_nombre);
                }
            }

            resolve(true);
        } catch (error) {
            reject(error)
        }
    })
};

const generarTemplate = async (template, respuestas) => {
    return new Promise( async (resolve, reject) => {
        try {

            let archivos = await obtenerTemplate(template);

            await Promise.each(archivos, async (archivo) => {
                let carpeta = archivo.indexOf('/') != -1 ? archivo.slice(0, archivo.lastIndexOf('/')) : null;

                if( carpeta ){
                    await makeDir(carpeta);
                }

                await copiarArchivo(template, archivo, respuestas);
            })
            resolve(true)
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generarTemplate