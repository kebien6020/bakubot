const { async: _async, await: _await } = require('asyncawait')

const osu = require('../util/osu_api')
const { OsuUser } = require('../db/models')

module.exports = {
    name: 'register',
    run: _async((msg, args) => {
        const hasMention = msg.mentions.users.size > 0

        const discordId = hasMention ? msg.mentions.users.first().id : msg.author.id
        let osuName = args.join(' ')
        if (hasMention)
            osuName = osuName.replace(/<@.*>/gi, '').trim() // remove the mention
        // Check the user against the osu-api
        // Also get its id since we want to store the id in the db
        let osuUser = null
        try {
            osuUser = _await (osu.getUser({u: osuName}))
        } catch (err) {
            msg.channel.send('No encontré el usuario ' + osuName)
            return
        }

        const osuId = osuUser.id

        // Check if the user has already an username associated
        try {
            const existingUser = _await(OsuUser.findOne({where: {discordId}}))
            // If the user has an osuId associated to it, update it
            if (existingUser) {
                existingUser.osuId = osuId
                _await (existingUser.save())
                msg.channel.send('Ya tenias un nombre de usuario de osu asociado, este ha sido reemplazado.')
                return
            }
        } catch (err) {
            msg.channel.send('Error mientras se revisaba si ya tenias un nombre de osu asociado: ' + err)
            return
        }

        // Save the association in the database
        try {
            _await (OsuUser.create({osuId, discordId}))
        } catch (err) {
            msg.channel.send('Error al intentar guardar en la base de datos: ' + err)
            return
        }

        msg.channel.send('Nombre de usuario de osu asociado exitosamente.')

    })
}
