const osu = require('node-osu')
const osuKey = require('../config').osuKey
const osuApi = new osu.Api(osuKey)

module.exports = osuApi
