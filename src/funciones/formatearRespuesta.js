module.exports = (url) => {
    return url.toLowerCase().str.replace(/ /g, '');
};