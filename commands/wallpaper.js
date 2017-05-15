const pickRandom = require('../util/pick_random')

module.exports = {
    name: 'wallpaper',
    run: (msg, args, cache) => {
        const imgUrl = pickRandom(cache.images.wallpaper)
        msg.reply(`Aquí tienes tu wallpaper\n${imgUrl}`)
    }
}
