const pickRandom = require('../util/pick_random')

module.exports = {
    name: 'hentai',
    nsfw: true,
    run: (msg, args, cache) => {
        const imgIdx = parseInt(args[0])
        if (cache.images.hentai.length === 0) {
            msg.channel.send('Cache de imágenes hentai vacia.')
            return
        } else if (!isNaN(imgIdx) && imgIdx < cache.images.hentai.length) {
            const imgUrl = cache.images.hentai[imgIdx]
            msg.reply(`Imagen hentai número ${imgIdx}\n${imgUrl}`)
        } else {
            const imgUrl = pickRandom(cache.images.hentai)
            msg.reply(`Aquí tienes tu hentai\n${imgUrl}`)
        }
    }
}
