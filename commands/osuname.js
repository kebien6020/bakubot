const { async: _async, await: _await } = require('asyncawait')

const osu = require('../util/osu_api')
const { OsuUser } = require('../db/models')

function normalize (str) {
    if (!str) return null
    return str.toLowerCase()
}

function searchUserInGuild(guild, query) {
    const normalQuery = normalize(query)
    const match = guild.members.find(member =>
        normalize(member.nickname) === normalQuery ||
        normalize(member.user.username) === normalQuery
    )
    if (!match) return null
    return match.user
}

module.exports = {
    name: 'osuname',
    run: _async((msg, args) => {
        let target = null
        if (args.length === 0) {
            target = msg.author
        } else if (msg.mentions.users.size > 0) {
            target = msg.mentions.users.first()
        } else {
            const query = args.join(' ')
            target = searchUserInGuild(msg.guild, query)
            if (target === null)
                return msg.channel.send(`No encontré a ${query} en el server`)
        }

        const name = msg.guild.members.get(target.id).nickname
                  || target.username

        let osuUser = null
        try {
            osuUser = _await (OsuUser.findOne({
                where: {discordId: target.id}
            }))
            if (!osuUser)
                return msg.channel.send(`No se como se llama ${name} en osu. Registralo con \`b.register @mention username\``)
        } catch (err) {
            return msg.channel.send('Error mientras buscaba al usuario en la base de datos: ' + err)
        }

        let osuApiUser = null
        try {
            osuApiUser = _await (osu.getUser({u: osuUser.osuId, type: 'id'}))
        } catch (err) {
            return msg.channel.send(`No encontre el nombre de usuario desde la id de osu (${osuUser.osuId}), ¿lo banearon o algo?`)
        }
        msg.channel.send(`El username de osu de ${name} es \`${osuApiUser.name}\``)

    })
}
