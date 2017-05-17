const Discord = require('discord.js')
const bot = new Discord.Client()

const fetch = require('isomorphic-fetch')

const { key } = require('./config')

const baseUrl = 'http://bakubot.ddns.net'

const cache = {
    images: {
        'hentai': [],
        'wallpaper': [],
        'baka': [],
    },
    htask: {}
}

const fetchImages = type => {
    fetch(baseUrl + `/images/${type}/files.json`)
        .then(res => res.json())
        .then(data => {
            cache.images[type] = data.images.map(path => baseUrl + path)
        })
}

;[
    'hentai',
    'wallpaper',
    'baka'
].forEach(fetchImages)

bot.on('ready', () => {
    console.log('Bakubot is f*king ON')
    Object.keys(cache.images).forEach(name => console.log(`Loaded ${cache.images[name].length} ${name} images`))
})

const newCommands = [
    'meme',
    'hentai',
    'wallpaper',
    'hstart',
    'hstop',
    'help',
    'baka',
    'invite',
    'agree',
    'sexy',
    'sexi',
    'say',
    'game',
    'id'
]

const commands = {}
newCommands.forEach(cName => {
    commands[cName] = require('./commands/' + cName)
})

function commandName(text) {
    return text.slice(2).split(' ')[0]
}

function isNewCommand(text) {
    const command = commandName(text)
    return text.startsWith('b.') && newCommands.indexOf(command) !== -1
}

function parseArgs(text) {
    return text.split(' ').slice(1)
}

bot.on('message', msg => {
    if (isNewCommand(msg.content)) {
        const command = commands[commandName(msg.content)]
        const args = parseArgs(msg.content)
        if (command.nsfw && !msg.channel.nsfw)
            msg.channel.send('Comando solo disponible en canales nsfw')
        else
            command.run(msg, args, cache, bot)
    }
})

bot.login(key)
