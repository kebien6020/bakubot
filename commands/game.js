const { ownerId } = require('../config')

module.exports = {
    name: 'game',
    run(msg, args, _, bot) {
        const text = args.join(' ')
        if (msg.author.id === ownerId)
            bot.user.setGame(text)
        else
            msg.channel.send(`Comando solo disponible para mi creador <@${ownerId}>`)
    }
}
