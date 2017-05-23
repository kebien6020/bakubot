const sankakuSearch = require('../util/sankaku_search')
const makeEmbed = require('../util/sankaku_make_embed')
const { async: _async, await: _await } = require('asyncawait')

const CACHE_SIZE = 100

const nextPrev = _async ((msg, cache, backwards = false) => {
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
    const index = backwards ? --scache.currentImg : ++scache.currentImg

    // Handle prev on the first image
    const prevMsg = scache.message
    if (index < 0) {
        scache.currentImg = 0
        const text = 'Estás en la primera imágen.'
        if (prevMsg.editable) {
            prevMsg.edit(text)
        } else {
            const newMsg = _await (msg.channel.send(text))
            scache.message = newMsg
        }
        if (msg.deletable)
            msg.delete()
        return
    }

    // Check if the index overflows, if so cache more images
    if (index >= scache.images.length) {
        const moreImages = _await(sankakuSearch(scache.search, CACHE_SIZE, ++scache.currentPage))
        if (moreImages.length === 0) {
            --scache.currentImg
            const text = 'No hay mas imágenes.'
            if (prevMsg.editable) {
                prevMsg.edit(text)
            } else {
                const newMsg = _await (msg.channel.send(text))
                scache.message = newMsg
            }
            if (msg.deletable)
                msg.delete()
            return
        }
        scache.images = scache.images.concat(moreImages)
    }

    const image = scache.images[index]

    // Edit the previous message if it still exists
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

module.exports = nextPrev
