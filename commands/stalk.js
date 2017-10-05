module.exports = {
    name: 'stalk',
    run(msg, args, cache) {
        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return msg.channel.send('Solo admins, sorry.')
        if (cache.stalking.indexOf(msg.channel.id) !== -1) {
            msg.channel.send('Este canal ya estaba siendo stalkeado.')
        } else {
            cache.stalking.push(msg.channel.id)
            msg.channel.send('Stalkeando este canal.')
        }
    },
}
