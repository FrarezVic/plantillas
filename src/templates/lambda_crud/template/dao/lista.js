const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = async (nombreTabla, elementos) => {

    console.log("Consulta de lista en tabla " + nombreTabla);
    let expresionAtributosValores = {};
    let expresionFiltros = '';
    let vLetra = 65;
    let constante = '';
    for (var prop in elementos) {
        console.log('elementos', JSON.stringify(elementos[prop]));

        let elementosArreglo = elementos[prop];
        let tituloObjeto = {};
        let index = 0;
        if(prop.includes("fecha")){
            let propFiltro = prop + '_timestamp';
            constante = String.fromCharCode(vLetra);
            if(elementosArreglo.length == 2){
                let tituloLlave1 = ":" + constante + "1";
                let tituloLlave2 = ":" + constante + "2";
                expresionFiltros += propFiltro + ' >= ' + tituloLlave1 + ' AND ' + propFiltro + ' <= ' + tituloLlave2 + ' AND ';
                tituloObjeto[tituloLlave1] = Math.round(((new Date(elementosArreglo[0])) / 1000) + 21600);
                tituloObjeto[tituloLlave2] = Math.round(((new Date(elementosArreglo[1])) / 1000) + 107999);
                Object.assign(expresionAtributosValores, tituloObjeto);
            }else{
                let tituloLlave1 = ":" + constante + "1";
                expresionFiltros += propFiltro + ' in (' + tituloLlave1 + ') AND ';
                let tituloObjeto = {};
                tituloObjeto[tituloLlave1] = Math.round(((new Date(elementosArreglo[0])) / 1000) + 21600);
                Object.assign(expresionAtributosValores, tituloObjeto);
            }
            vLetra ++;
        }else{
            let tituloLlave = '';
            constante = String.fromCharCode(vLetra);
            elementosArreglo.forEach(function (value) {
                index++;
                tituloLlave = ":" + constante + index;
                if(prop == "sku"){
                    tituloObjeto[tituloLlave.toString()] = value;
                }else{
                    tituloObjeto[tituloLlave.toString()] = typeof value == "boolean" ? value : isNaN(value) ? value : parseInt(value, 10);
                }
            });
            console.log("tituloObjeto: ", tituloObjeto);
            Object.assign(expresionAtributosValores, tituloObjeto);
            expresionFiltros += prop + ' in (' + Object.keys(tituloObjeto).toString() + ') AND ';
            vLetra ++;
        }
    }
    
    expresionFiltros = expresionFiltros.slice(0, expresionFiltros.length - 5);
    console.log('expresionAtributosValores', JSON.stringify(expresionAtributosValores));
    console.log('expresionFiltros', JSON.stringify(expresionFiltros));
    const params = {
        TableName: nombreTabla
    };

    if (Object.keys(expresionAtributosValores).length > 0) {
        params.FilterExpression = expresionFiltros;
        params.ExpressionAttributeValues = expresionAtributosValores;
    }

    let scanResults = [];
    let items;

    do {

        items = await dynamoDB.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;

    } while (items.LastEvaluatedKey);
    return scanResults;

};