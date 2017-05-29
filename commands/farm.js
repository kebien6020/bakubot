const { async: _async, await: _await } = require('asyncawait')
const argsParser = require('minimist')

const osu = require('../util/osu_api')
const players = require('../util/osu_players')
const { OsuUser } = require('../db/models')
const TIMEOUT = 5000 // 5 sec
const HARD_TIMEOUT = 30000 // 30sec

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

const modeNames = [
    'std', 'taiko', 'catch', 'mania'
]

const userUrl = id => `https://osu.ppy.sh/u/${id}`

class Victim {
    constructor(rank, osuId, discordId = null, osuName = null, discordName = null) {
        this.rank = rank
        this.osuId = osuId
        this.discordId = discordId
        this.osuName = osuName
        this.discordName = discordName
    }

    toString() {
        if (this.discordName) return `[${this.discordName}](${userUrl(this.osuId)})`
        if (this.rank && this.osuName) return `[#${this.rank}](${userUrl(this.osuId)})`
        return this.osuId
    }
}

const getGuildUsers = _async ((guild) => {
    const members = guild.members.array()
    const osuUsers = _await (OsuUser.findAll({
        where:{discordId: {$in: members.map(m => m.id)}}
    }))

    return osuUsers.map(user => {
        const discordName = guild.members.get(user.discordId).user.username
        return new Victim(null, user.osuId, user.discordId, null, discordName)
    })
})

const getUsersFromRank = (minRank, players) => {
    const filtered = Object.keys(players).filter(rank => Number(rank) <= minRank)
    const sortedByRank = filtered.sort((a, b) => Number(b) - Number(a)) // Descendent
    return sortedByRank.map(rank => new Victim(rank, players[rank]))
}

const editOrNew = (msg, content, opts) => {
    if (msg.editable)
        return msg.edit(content, opts)
    else
        return msg.channel.send(content, opts)
}

// Taken from object entries polyfill
const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
const concat = Function.bind.call(Function.call, Array.prototype.concat)
const keys = Reflect.ownKeys
const objEntries = obj =>
    reduce(keys(obj), (e, k) => concat(e, typeof k === 'string' && isEnumerable(obj, k) ? [[k, obj[k]]] : []), [])

const contains = (str, sub) => str.indexOf(sub) !== -1

const hasMods = (score, mods) => {
    return mods.every(mod => contains(score.mods, mod))
}

const downloadScores = (victims, mode, minPP, mods) => {
    const scores = []
    const timeout = TIMEOUT
    const startTime = Date.now()
    for (const victim of victims) {
        if (Date.now() - startTime > timeout && scores.length >= 10) break
        // TODO: throw error, notify user that he should use a higher target rank
        if (Date.now() - startTime > HARD_TIMEOUT) break
        let victimScores = null
        try {
            victimScores = _await (osu.getUserBest({u: victim.osuId, type: 'id', m: mode, limit: 50}))
        } catch (err) {
            // If we can't get the scores of someone, simply skip them
            continue
        }
        // Include victim object inside of each score
        const scoresWithVictims = victimScores
            .filter(score => Number(score.pp) >= minPP)
            .filter(score => hasMods(score, mods))
            .map(score => {
                score.victim = victim
                return score
            })
        Array.prototype.push.apply(scores, scoresWithVictims)
    }
    return scores
}

const scoreAcc = (score, mode) => {
    const count50 = Number(score.counts[50])
    const count100 = Number(score.counts[100])
    const count300 = Number(score.counts[300])
    const katu = Number(score.counts.katu)
    const geki = Number(score.counts.geki)
    const misses = Number(score.counts.miss)

    // https://osu.ppy.sh/wiki/Accuracy
    switch (mode) {
    case 'taiko': {
        const pointHits = (count100 * 0.5 + count300) * 300
        const numberOfHits = misses + count100 + count300
        return (pointHits) / (numberOfHits * 300) * 100
    }
    case 'catch': {
        const missedDroplets = katu
        const fruitsCaught = count50 + count100 + count300
        const totalFruits = fruitsCaught + misses + missedDroplets
        return fruitsCaught / totalFruits * 100
    }
    case 'mania': {
        const count200 = katu
        const countMax = geki
        const pointHits = count50 * 50 + count100 * 100 + count200 * 200 + (count300 + countMax) * 300
        const numberOfHits = misses + count50 + count100 + count200 + count300 + countMax
        return (pointHits) / (numberOfHits * 300) * 100
    }
    case 'std':
    default: {
        const pointHits = count50 * 50 + count100 * 100 + count300 * 300
        const numberOfHits = misses + count50 + count100 + count300
        return (pointHits) / (numberOfHits * 300) * 100
    }

    }
}

const beatmapUrl = id => `https://osu.ppy.sh/b/${id}`

const formatTime = seconds => {
    const fl = val => Math.floor(val)
    const fl2 = val => fl(val) < 10 ? '0' + String(fl(val)) : String(fl(val))
    let res = ''
    if (seconds >= 3600)
        res += fl(seconds/3600) + 'h'
    if (seconds >= 60)
        res += fl2((seconds%3600)/60) + 'm'
    res += fl2(seconds%60) + 's'
    return res
}

const modList = {
    'Easy': 'EZ',
    'Hidden': 'HD',
    'HardRock': 'HR',
    'DoubleTime': 'DT',
    'HalfTime': 'HT',
    'FlashLight': 'FL',
    'Perfect': 'PF',
    'FadeIn': 'FI',
    'Random': 'RD',
}

const formatMods = mods => {
    if (mods.length === 0)
        return 'NoMod'
    return '+' + mods.map(mod => modList[mod]).join('')
}

const renderScore = (score, mode) => {
    const pp = Number(score.pp).toFixed()
    const acc = scoreAcc(score, mode).toFixed(2)
    const { beatmap } = score
    return pp + 'pp | '
         + score.rank.replace(/X/g, 'SS') + ' | '
         + acc + '% | '
         + 'x' + score.maxCombo + ' | '
         + formatMods(score.mods) + ' | '
         + `[${beatmap.artist} - ${beatmap.title} [${beatmap.version}]](${beatmapUrl(beatmap.id)}) | `
         + formatTime(Number(beatmap.time.drain)) + ' | '
         + score.victim.toString()
}

const renderScores = (scores, mode) => {
    const prefix = 'PP | Rank | Acc | Combo | Mods | Beatmap | Duración | Jugador\n\n'
    return {
        embed: {
            description: prefix + scores.map(score => renderScore(score, mode)).join('\n\n')
        }
    }

}

module.exports = {
    name: 'farm',
    run: _async((msg, args) => {
        // Parse the arguments
        const opts = argsParser(args, {
            'boolean': ['local'],
            'string': ['mode'],
            'alias': {
                'l': 'local',
                'p': 'pp',
                'm': 'mode',
                'r': 'rank'
            }
        })
        const localOpt = opts.local
        const ppOpt = opts.pp !== undefined ? opts.pp : false
        const modeOpt = opts.mode !== undefined ? opts.mode : false
        const rankOpt = opts.rank !== undefined ? opts.rank : false
        const modsOpt = opts.hasOwnProperty('_')
                      ? opts['_'].join('').replace(/\+/g, '').toLowerCase()
                      : false

        // Query the osu id from the db
        const discordId = msg.author.id
        let osuId = null
        try {
            const row = _await (OsuUser.findOne({where: {discordId}}))
            osuId = row.osuId
        } catch (err) {
            msg.channel.send('No se como te llamas en osu, usa `b.register <tu user en osu>`')
            return
        }

        // Decide on the game mode
        if (modeOpt && !(modeOpt in modes)) {
            msg.channel.send('No conozco el modo `' + modeOpt + '`.')
            return
        }
        const mode = modeOpt ? modes[modeOpt.toLowerCase()] : modes.osu
        const modeName = modeNames[mode]

        // Query the user in the osu api
        let osuUser = null
        try {
            osuUser = _await (osu.getUser({u: osuId, type: 'id', m: mode}))
        } catch (err) {
            msg.channel.send('WTF no te encontré en osu, ¿fuiste baneado o algo?.')
            return
        }

        // Min pp to look for
        let minPP = null
        if (ppOpt)
            minPP = ppOpt
        else
            try {
                const topRanks = _await (osu.getUserBest({u: osuId, type: 'id', m: mode}))
                // By default try to use 90% of user's top rank
                minPP = Number(topRanks[0].pp) * 0.9
            } catch (err) {
                msg.channel.send('Error tratando de averiguar tu top rank.')
                return
            }

        // Min tank to look for
        let minRank = null
        if (rankOpt)
            minRank = rankOpt
        else
            minRank = Number(osuUser.pp.rank) - 1

        // Let the user know what we're up to
        let initialMessage = `Modo: ${modeName}\nMinimo pp: ${minPP.toFixed()}pp\n`

        // Select our victims
        let victims = null
        if (localOpt) {
            initialMessage += 'Victimas: gente del server'
            victims = _await (getGuildUsers(msg.guild))
        } else {
            initialMessage += `Victimas: gente con rank #${minRank} o mejor`
            victims = getUsersFromRank(minRank, players[modeName])
        }

        // Mods
        let askedMods = []
        if (modsOpt) {
            askedMods =
                objEntries(modList)
                .map(([key, val]) =>
                    contains(modsOpt, key.toLowerCase()) || contains(modsOpt, val.toLowerCase())
                  ? key
                  : false)
                .filter(mod => mod)
            initialMessage += '\nMods: ' + askedMods.join(', ')
        }
        msg.channel.send(initialMessage)

        // Get top ranks of victims
        const botMsg = _await(msg.channel.send(`Obteniendo top ranks de las víctimas (${TIMEOUT/1000} segundos) ...`))
        let allScores = null
        try {
            allScores = _await(downloadScores(victims, mode, minPP, askedMods))
        } catch (err) {
            editOrNew(botMsg, 'Error tratando de obtener puntajes de las víctimas: ' + err)
            return
        }

        // Sort by pp I guess, ascendent
        // TODO: add a sorting option
        const sortedScores = allScores.sort((a, b) => Number(a.pp) - Number(b.pp))

        // Recommend only the first 10
        const finalScores = sortedScores.slice(0, 10)

        // Download beatmap information for each score
        editOrNew(botMsg, 'Consultando informacion de los beatmaps...')
        try {
            for (const score of finalScores) {
                const beatmap = _await (osu.getBeatmaps({b: score.beatmapId}))[0]
                score.beatmap = beatmap
            }
        } catch (err) {
            editOrNew(botMsg, 'Error descargando información de los mapas a recomendar: ' + err)
            return
        }

        // Download name of each victim
        editOrNew(botMsg, 'Consultando nombres de las victimas...')
        try {
            for (const score of finalScores) {
                if (score.victim.discordName) continue
                const user = _await (osu.getUser({u: score.victim.osuId, type: 'id'}))
                score.victim.osuName = user.name
                score.victim.rank = user.pp.rank
            }
        } catch (err) {
            editOrNew(botMsg, 'Error descargando el nombre de algunas víctimas: ' + err)
            return
        }

        // Show final scores (render as embed to leverage full markdown)
        editOrNew(botMsg, '', renderScores(finalScores, modeName))
    })
}
