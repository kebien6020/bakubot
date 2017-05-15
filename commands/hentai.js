const pickRandom = require('../util/pick_random')

module.exports = {
    name: 'hentai',
    nsfw: true,
    run: (msg, args, cache) => {
        if (cache.images.hentai.length === 0)
            msg.channel.send('Cache de imágenes hentai vacia.')
        const imgUrl = pickRandom(cache.images.hentai)
        msg.reply(`Aquí tienes tu hentai\n${imgUrl}`)
    }
}
