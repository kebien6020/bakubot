const pickRandom = require('../util/pick_random')

module.exports = {
    name: 'hentai',
    nsfw: true,
    run: ({channel, author}, args, cache) => {
        const imgIdx = parseInt(args[0])
        const mention = author !== undefined ? author + ', ' : ''
        if (cache.images.hentai.length === 0) {
            channel.send('Cache de imágenes hentai vacia.')
            return
        } else if (!isNaN(imgIdx) && imgIdx < cache.images.hentai.length) {
            const imgUrl = cache.images.hentai[imgIdx]
            channel.send(`${mention}Imagen hentai número ${imgIdx}\n${imgUrl}`)
        } else {
            const imgUrl = pickRandom(cache.images.hentai)
            channel.send(`${mention}Aquí tienes tu hentai\n${imgUrl}`)
        }
    }
}
