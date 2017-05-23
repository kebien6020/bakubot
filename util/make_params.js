const objMap = require('./obj_map')

const makeParams = obj =>
    '?' + objMap(obj, (key, val) => key + '=' + val).join('&')

module.exports = makeParams
