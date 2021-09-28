module.exports = () => {
    let partes = process.cwd().split('\\');
    return partes[partes.length - 1];
};