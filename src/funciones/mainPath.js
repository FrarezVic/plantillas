const path = require('path');

module.exports = () => {
    return path.dirname(require.main.filename).slice(0, -3) + '/src';
};