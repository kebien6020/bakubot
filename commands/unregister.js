const { async: _async, await: _await } = require('asyncawait')

const { OsuUser } = require('../db/models')

module.exports = {
    name: 'unregister',
    run: _async((msg) => {
        // Use the mention or default to the author
        const discordId = msg.mentions.users.size > 0
                        ? msg.mentions.users.first().id
                        : msg.author.id

        // Retrieve the user from the db
        let user = null
        try {
            user = _await (OsuUser.findOne({where: {discordId}}))
        } catch (err) {
            msg.channel.send(`No econtre a <@${discordId}> en mi base de datos`)
            return
        }

        // Delete the user
        // TODO: use soft-deleting
        try {
            _await (user.destroy())
        } catch (err) {
            msg.channel.send(`Error borrando a <@${discordId}> de la base de datos: ${err}`)
            return
        }

        msg.channel.send('Usuario eliminado de mi base de datos.')


    })
}
