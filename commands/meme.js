const pickRandom = require('../util/pick_random')

const memeList = [
    'tenguy',
    'afraid',
    'older',
    'aag',
    'tried',
    'biw',
    'blb',
    'kermit',
    'bd',
    'ch',
    'cbg',
    'wonka',
    'cb',
    'keanu',
    'dsm',
    'live',
    'ants',
    'doge',
    'alwaysonbeat',
    'ermg',
    'facepalm',
    'fwp',
    'fa',
    'fbf',
    'fmr',
    'fry',
    'ggg',
    'hipster',
    'icanhas',
    'crazypills',
    'mw',
    'noidea',
    'regret',
    'boat',
    'hagrid',
    'sohappy',
    'captain',
    'inigo',
    'iw',
    'ackbar',
    'happening',
    'joker',
    'ive',
    'll',
    'morpheus',
    'mb',
    'badchoice',
    'mmm',
    'jetpack',
    'imsorry',
    'red',
    'mordor',
    'oprah',
    'oag',
    'remembers',
    'philosoraptor',
    'jw',
    'patrick',
    'rollsafe',
    'sad-obama',
    'sad-clinton',
    'sadfrog',
    'sad-bush',
    'sad-biden',
    'sad-boehner',
    'saltbae',
    'sarcasticbear',
    'dwight',
    'sb',
    'ss',
    'sf',
    'dodgson',
    'money',
    'snek',
    'sohot',
    'nice',
    'awesome-awkward',
    'awesome',
    'awkward-awesome',
    'awkward',
    'fetch',
    'success',
    'scc',
    'ski',
    'officespace',
    'interesting',
    'toohigh',
    'bs',
    'center',
    'both',
    'winter',
    'xy',
    'buzz',
    'yodawg',
    'yuno',
    'yallgot',
    'bad',
    'elf',
    'chosen'
]

const help = '```\nLista de Memes\n'
           + memeList.map(s => '  ' + s).join('\n') + '\n'
           + 'Ejemplo: b.meme ' + pickRandom(memeList) + ' texto1, texto2\n'
           + '```'


module.exports = {
    name: 'meme',
    run: (msg, args) => {
        if (args.length === 0) {
            msg.reply('Te envié una lista de memes por mensaje privado')
            msg.author.createDM().then(chan => chan.send(help))
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
    }
}
