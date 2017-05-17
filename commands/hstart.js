const cron = require('node-cron')
const hentai = require('./hentai')

const sepToSchedule = {
    hr: '0 0 * * * *',
    min: '0 * * * * *',
    med: '0,30 * * * * *'
}

const sepToMsg = {
    hr: 'cada hora en punto',
    min: 'cada minuto',
    med: 'cada treinta segundos'
}

module.exports = {
    name: 'hstart',
    nsfw: true,
    run(msg, args, cache) {
        const chanId = msg.channel.id
        const sep = sepToSchedule[args[0]] !== undefined ? args[0] : 'hr'
        const schedule = sepToSchedule[sep]

        if (!cache.htask[chanId] || args[0]) {
            if (cache.htask[chanId]) cache.htask[chanId].stop()
            cache.htask[chanId] = cron.schedule(schedule, () => {
                hentai.run({channel: msg.channel}, [], cache)
            }, false)
        }

        if (cache.htask[chanId].tick !== null) {
            msg.channel.send('Ya habia una tarea programada')
            return
        }

        cache.htask[chanId].start()
        msg.channel.send('Se hará b.hentai ' + sepToMsg[sep] + ' en este canal')
    },
}
