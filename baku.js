const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
const levels = require('./special/levels')

const fetch = require('isomorphic-fetch')

const { key } = require('./config')

const baseUrl = 'http://bakubot.ddns.net'

const cache = {
    images: {
        'hentai': [],
        'wallpaper': [],
        'baka': [],
    },
    htask: {},
    sankaku: {},
    stalking: [],
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

function loadCommands(dir) {
    const files = fs.readdirSync(dir)
    const commands = files.map(f => require(dir + '/' + f))
    const res = {}
    commands.forEach(cmd => {
        res[cmd.name] = cmd
    })
    return res
}

const commands = loadCommands('./commands')

bot.on('ready', () => {
    console.log('Bakubot is f*king ON')
    console.log('--- Images ---')
    Object.keys(cache.images).forEach(name => console.log(`Loaded ${cache.images[name].length} ${name} images`))
    console.log('--- Commands ---')
    const commandNames = Object.keys(commands)
    console.log(`Loaded ${commandNames.length} commands: ${commandNames.join(', ')}`)
})

function commandName(text) {
    return text.slice(2).split(' ')[0]
}

function isCommand(text) {
    const command = commandName(text)
    return text.startsWith('b.') && command in commands
}

function parseArgs(text) {
    return text.split(' ').slice(1)
}

bot.on('message', msg => {
    if (isCommand(msg.content)) {
        const command = commands[commandName(msg.content)]
        const args = parseArgs(msg.content)
        if (command.nsfw && !(msg.channel.nsfw || msg.channel.type === 'dm' ))
            msg.channel.send('Comando solo disponible en canales nsfw')
        else
            command.run(msg, args, cache, bot)
    }
    if (!msg.author.bot)
        levels(msg)
})

bot.login(key)
