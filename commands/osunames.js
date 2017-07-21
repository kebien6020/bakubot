const { async: _async, await: _await } = require('asyncawait')

const osu = require('../util/osu_api')
const { OsuUser } = require('../db/models')

function getName(guild, discordId) {
    const member = guild.members.get(discordId)
    if (!member) return null
    return member.nickname || member.user.username
}

function renderResult(result) {
    if (!result) return null
    const { discordName, osuName } = result
    return discordName + ' → ' + osuName
}

module.exports = {
    name: 'osunames',
    run: _async((msg) => {
        // const memberIds = msg.guild.members.map(m => m.id)

        let osuUsers = null
        try {
            osuUsers = _await (OsuUser.findAll({
                where: {
                    // discordId: memberIds    // WHERE discordId IN (list)
                }
            }))
        } catch (err) {
            return msg.channel.send('Error obteniendo usuarios de la base de datos: ' + err)
        }

        const results = osuUsers.map(osuUser => {
            const discordName = getName(msg.guild, osuUser.discordId) || '<@' + osuUser.discordId + '>'
            let osuApiUser = null
            try {
                osuApiUser = _await (osu.getUser({u: osuUser.osuId, type: 'id'}))
            } catch (err) {
                return msg.channel.send(`No encontre el nombre de usuario desde la id de osu (${osuUser.osuId}), ¿lo banearon o algo?`)
            }
            const osuName = osuApiUser.name
            return {
                discordName,
                osuName
            }
        })

        if (results.length === 0)
            return msg.channel.send('No tengo usuarios registrados, usa b.register para registrar unos cuantos.')

        msg.channel.send(results.map(renderResult).join('\n'))
    })
}
