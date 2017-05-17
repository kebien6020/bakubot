const pickRandom = require('../util/pick_random')

module.exports = {
    name: 'baka',
    run(msg, args, cache) {
        const imgUrl = pickRandom(cache.images.baka)
        msg.channel.send(`${imgUrl}`)
    },
}
