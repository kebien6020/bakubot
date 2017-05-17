// Important!!: this maps an object to an array
module.exports = function objMap(obj, callback) {
    return Object.keys(obj).map(key => {
        const val = obj[key]
        return callback.apply(obj, [key, val])
    })
}
