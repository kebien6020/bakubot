const fetchJson = require('../util/fetch_json')
const pickRandom = require('../util/pick_random')
const objMap = require('../util/obj_map')
const _async = require('asyncawait/async')
const _await = require('asyncawait/await')

const help = (fullList, page, total) => {
    const sliceFrom = Math.floor(fullList.length / total * (page - 1))
    const sliceTo = Math.floor(fullList.length / total * page)
    const memeList = fullList.slice(sliceFrom, sliceTo)
    return '```\nLista de Memes ' + `(Página ${page}/${total})\n`
           + memeList.map(s => `  ${s.name} (${s.shortName})`).join('\n') + '\n'
           + 'Ejemplo: b.meme ' + pickRandom(memeList).shortName + ' texto1, texto2\n'
           + '```'
}

const memeUrl = 'https://memegen.link/api/templates/'

module.exports = {
    name: 'meme',
    run: _async ((msg, args) => {
        if (args.length === 0) {
            try {
                const data = _await (fetchJson(memeUrl))
                const memeList = objMap(data, (fullName, url) => ({
                    name: fullName,
                    shortName: url.match(/\/([^\/]+)$/i)[1]
                }))
                msg.reply('Te envié una lista de memes por mensaje privado')
                const privateChannel = _await (msg.author.createDM())

                _await (privateChannel.send(help(memeList, 1, 2)))
                privateChannel.send(help(memeList, 2, 2))
            } catch (err) {
                if (err.startsWith('Error while fetching'))
                    msg.channel.send('Error obteniendo la lista de memes desde http://memegen.link')
                else
                    msg.channel.send(err)
            }
            // fetchJson(memeUrl)
            //     .then(data => {
            //         const memeList = objMap(data, (fullName, url) => ({
            //             name: fullName,
            //             shortName: url.match(/\/([^\/]+)$/i)[1]
            //         }))
            //         msg.reply('Te envié una lista de memes por mensaje privado')
            //         msg.author.createDM()
            //             .then(chan => chan.send(help(memeList)))
            //     })
            //     .catch(err => {
            //         msg.channel.send('Error obteniendo la lista de memes desde http://memegen.link\n' + err)
            //     })
        } else if (args.length === 1) {
            msg.channel.send(`https://memegen.link/${args[0]}/_.jpg`)
        } else {
            const rest = args.slice(1).join(' ')
            const trim = s => s.trim()
            const dashCase = s => s.replace(/\s/g, '-').replace(/\?/g, '~q')
            // eslint-disable-next-line prefer-const
            let [text1, text2] = rest.split(',').map(trim).map(dashCase)
            if (!text2) text2 = '_'
            msg.channel.send(`https://memegen.link/${args[0]}/${text1}/${text2}.jpg`)

        }
    })
}
