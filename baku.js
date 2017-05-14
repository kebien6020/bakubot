const Discord = require('discord.js')
const bot = new Discord.Client()
const fetch = require('isomorphic-fetch')

const { key, appId, ownerId } = require('./config')

const baseUrl = 'http://bakubot.ddns.net'

const images = {}

const fetchImages = type => {
    fetch(baseUrl + `/images/${type}/files.json`)
        .then(res => res.json())
        .then(data => {
            images[type] = data.images.map(path => baseUrl + path)
        })
}

;[
    'hentai',
    'wallpaper',
    'baka'
].forEach(fetchImages)

bot.on('ready', () => {
    console.log('Bakubot is f*king ON')
    Object.keys(images).forEach(name => console.log(`Loaded ${images[name].length} ${name} images`))
    // console.log(JSON.stringify(images, null, 2))
})

function rnd(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function pickRandom(arr) {
    const index = rnd(0, arr.length)
    return arr[index]
}

bot.on('message', msg => {
    if (msg.content.startsWith('b.hentai')){
        const imgUrl = pickRandom(images.hentai)
        if (!msg.channel.nsfw)
            msg.channel.send('Comando solo disponible en #nsfw')
        else
            msg.reply(`Aquí tienes tu hentai\n${imgUrl}`)
    }

    if (msg.content.startsWith('b.wallpaper')){
        const imgUrl = pickRandom(images.wallpaper)
        msg.reply(`Aquí tienes tu wallpaper\n${imgUrl}`)
    }

    if (msg.content.startsWith('b.baka')){
        const imgUrl = pickRandom(images.baka)
        msg.channel.send(`${imgUrl}`)
    }

    if (msg.content.startsWith('b.help')){
        const helpMsg = `\`\`\`
Comandos
  b.help      Muestra este mensaje
  b.wallpaper Un wallpaper
  b.hentai    Imagen hentai (solo nsfw)
  b.baka      B-Baka!
  b.invite    Muestra el link para entrar a un server
  b.say       Decir un mensaje y borrar el comando
  b.agree     Estoy de acuerdo
  b.sexy      Dime lo sexy que soy
\`\`\``
        msg.channel.send(helpMsg)
    }
    if (msg.content.startsWith('b.invite'))
        msg.channel.send('', {
            embed: {
                title: 'Úneme a tu server',
                url: `https://discordapp.com/oauth2/authorize?client_id=${appId}&scope=bot`
            }
        })
    if (msg.content.startsWith('b.agree'))
        msg.channel.send(`Sí, lo que ${msg.author} dijo`)
    if (msg.content.startsWith('b.sexy'))
        msg.reply('Gracias, lo se.')
    if (msg.content.startsWith('b.sexi'))
        msg.reply('Es sexy con "y", pero gracias, ya sabía.')
    if (msg.content.startsWith('b.say')) {
        msg.channel.send(msg.content.slice(6))
        if (msg.deletable) msg.delete()
    }
    if (msg.content.startsWith('b.game')) {
        const text = String(msg.content.slice(7))
        if (msg.author.id === ownerId)
            bot.user.setGame(text)
        else
            msg.channel.send(`Comando solo disponible para mi creador <@${ownerId}>`)
    }
})

bot.login(key)
