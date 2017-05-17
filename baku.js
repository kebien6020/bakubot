const Discord = require('discord.js')
const bot = new Discord.Client()

const fetch = require('isomorphic-fetch')

const { key, appId, ownerId } = require('./config')

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
    'invite'
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
            command.run(msg, args, cache)
    }

    if (msg.content.startsWith('b.agree'))
        msg.channel.send(`Sí, lo que ${msg.author} dijo`)
    if (msg.content.startsWith('b.sexy'))
        msg.reply('Gracias, lo se.')
    if (msg.content.startsWith('b.sexi'))
        msg.reply('Es sexy con "y", pero gracias, ya sabía.')
    if (msg.content.startsWith('b.say')) {
        msg.channel.send(msg.content.slice(6), {tts: true})
        if (msg.deletable) msg.delete()
    }
    if (msg.content.startsWith('b.game')) {
        const text = String(msg.content.slice(7))
        if (msg.author.id === ownerId)
            bot.user.setGame(text)
        else
            msg.channel.send(`Comando solo disponible para mi creador <@${ownerId}>`)
    }
    if (msg.content.startsWith('b.id'))
        msg.channel.send(`Your user id is ${msg.author.id}`)
})

bot.login(key)
