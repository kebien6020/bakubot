module.exports = {
    name: 'hstop',
    nsfw: true,
    run(msg, args, cache) {
        const chanId = msg.channel.id
        if (!cache.htask[chanId]) {
            msg.channel.send('No se habia hecho hstart.')
        } else if (cache.htask[chanId].tick === null) {
            msg.channel.send('No habia tarea programada.')
        } else {
            cache.htask[chanId].stop()
            msg.channel.send('No se hará b.hentai automáticamente.')
        }

    }
}
