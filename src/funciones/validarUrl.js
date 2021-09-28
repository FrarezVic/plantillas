module.exports = (url) => {
    return url.startsWith('/') ? url : `/${url}`;
}