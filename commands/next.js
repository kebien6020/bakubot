const sankakuSearch = require('../util/sankaku_search')
const makeEmbed = require('../util/sankaku_make_embed')
const { async: _async, await: _await } = require('asyncawait')

const CACHE_SIZE = 100

module.exports = {
    name: 'next',
    run: _async ((msg, _, cache) => {
        const cacheId = msg.author.id + ',' + msg.channel.id

        if (!cache.sankaku.hasOwnProperty(cacheId)) {
            // I can't know what to search for
            msg.channel.send('No has hecho ninguna búsqueda con b.img, b.imgh o b.sankaku')
            return
        }

        const scache = cache.sankaku[cacheId]

        // Cache some images if they havent been cached
        if (!scache.hasOwnProperty('images'))
            scache.images = _await(sankakuSearch(scache.search, CACHE_SIZE))


        // Update and get the currentImg
        const index = ++scache.currentImg

        // Check if the index overflows, if so cache more images
        if (index >= scache.images.length) {
            const moreImages = _await(sankakuSearch(scache.search, CACHE_SIZE, ++scache.currentPage))
            scache.images = scache.images.concat(moreImages)
        }
        const image = scache.images[index]

        // Edit the previous message if it still exists
        const prevMsg = scache.message
        if (prevMsg.editable) {
            prevMsg.edit(image.link, makeEmbed(image))
        } else {
            console.log('Could not edit message')
            const newMsg = _await (msg.channel.send(image.link, makeEmbed(image)))
            scache.message = newMsg
        }

        // Delete the command itself to prevent flooding the chat
        if (msg.deletable)
            msg.delete()
    })
}
