module.exports = {
    name: 'unstalk',
    run(msg, args, cache) {
        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return msg.channel.send('Solo admins, sorry.')
        const index = cache.stalking.indexOf(msg.channel.id)
        if (index === -1) {
            msg.channel.send('Este canal no estaba siendo stalkeado.')
        } else {
            cache.stalking.splice(index, 1)
            msg.channel.send('Ok ok, ya no mas stalkeo en este canal.')
        }
    },
}
