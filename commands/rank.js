const { async: _async, await: _await } = require('asyncawait')
const argsParser = require('minimist')
const { OsuUser } = require('../db/models')
const osu = require('../util/osu_api')

const modeNames = [
    'std', 'taiko', 'catch', 'mania'
]

const modes = {
    'osu': 0,
    'std': 0,
    'standard': 0,
    'o': 0,
    'taiko': 1,
    't': 1,
    'catch': 2,
    'ctb': 2,
    'c': 2,
    'mania': 3,
    'm': 3,
}

function detectInGuild(name, guild) {
    const membersMatching = guild.members.filter(m => {
        const nickname = m.nickname ? m.nickname.toLowerCase() : null
        const username = m.user.username.toLowerCase()
        const nameLower = name.toLowerCase()
        return (nickname && nickname === nameLower) || username === nameLower
    })

    if (membersMatching.size > 0)
        return membersMatching.first().user

    return null
}

const getUserOnBestMode = _async((osuUser) => {
    const allResponses =
        _await(Promise.all([
            osu.getUser({u: osuUser, m: 0}),
            osu.getUser({u: osuUser, m: 1}),
            osu.getUser({u: osuUser, m: 2}),
            osu.getUser({u: osuUser, m: 3})]))

    allResponses[0].mode = 0
    allResponses[1].mode = 1
    allResponses[2].mode = 2
    allResponses[3].mode = 3

    const sorted = allResponses
        .sort((a, b) => Number(b.pp.raw) - Number(a.pp.raw))

    return sorted[0]
})

module.exports = {
    name: 'rank',
    run: _async((msg, args) => {
        if (args.length === 0)
            return msg.channel.send('`Uso: b.rank @mention [-m ctb|osu|taiko|mania]\nSi no colocas modo se autodetectará.`')

        const opts = argsParser(args, {
            'string': ['mode'],
            'alias': {
                'm': 'mode',
            }
        })

        const modeOpt = opts.mode !== undefined ? opts.mode : false
        const otherArgs = opts['_'].join(' ')

        let discordUser = null

        if (msg.mentions.users.size > 0)
            discordUser = msg.mentions.users.first()

        if (discordUser === null)
            discordUser = detectInGuild(otherArgs, msg.guild)

        let osuUser = null
        if (discordUser !== null) {
            const discordId = discordUser.id
            try {
                const row = _await (OsuUser.findOne({where: {discordId}}))
                osuUser = row.osuId
            } catch (err) {
                msg.channel.send(`No se como se llama ${discordUser} en osu, usa \`b.register <tu user en osu>\``)
                return
            }
        } else {
            osuUser = otherArgs
        }

        // Decide on the game mode
        if (modeOpt && !(modeOpt in modes)) {
            msg.channel.send('No conozco el modo `' + modeOpt + '`.')
            return
        }

        let rank = null
        let mode = null
        try {
            if (modeOpt) {
                mode = modes[modeOpt.toLowerCase()]
                const userFromApi = _await (osu.getUser({u: osuUser, m: mode}))
                rank = userFromApi.pp.rank
            } else {
                const userFromApi = _await (getUserOnBestMode(osuUser))
                mode = userFromApi.mode
                rank = userFromApi.pp.rank
            }
        } catch (err) {
            return msg.channel.send(`No pude encontrar el usuario ${osuUser} en osu`)
        }

        const modeName = modeNames[mode]

        const who = discordUser || osuUser

        msg.channel.send(`El rank de ${who} en modo ${modeName} es #${rank}`)

    })
}
