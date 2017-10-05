const Discord = require('discord.js')

function rnd(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Called on every message
module.exports = function levels(msg) {
    const random = rnd(1, 10000)
    // Possibility of 1 in 10 000
    if (random === 1) {
        const lvl = rnd(100, 1000)
        const points = rnd(-200, 100)
        const description = `Nuevo nivel: ${lvl}\nGanas ${points} puntos\n(lol)`
        const embed = new Discord.RichEmbed()
            .setTitle(`¡${msg.author.username} sube de nivel!`)
            .setDescription(description)
            .setColor('#00AE86')
            .setThumbnail('http://bakubot.ddns.net/trollface.jpg')

        msg.channel.send({embed})
    }
}
