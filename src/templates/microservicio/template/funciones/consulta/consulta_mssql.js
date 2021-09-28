require('../../configuraciones/config');
const sql = require('mssql');
const dbConfig = global.gConfig.database_config_mssql;

exports.consultar = async function (req) {
    return new Promise(async (resolve, reject) => {

        let client;

        try {
            client = await new sql.ConnectionPool(dbConfig).connect();

            // let columnas = '*';
            // let tabla = '';
            // let resultado = await client.request()
            // .input('atributo', req.valor)
            // .query(`select ${columnas} from ${tabla} where atributo = @atributo`);
            // resolve(resultado.recordset);

            resolve([]);
        } catch (err) {
            reject(err);
        } finally {
            if (client) {
                client.close();
            }
        }
    });
};