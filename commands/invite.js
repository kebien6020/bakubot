const { appId } = require('../config')

module.exports = {
    name: 'invite',
    run(msg) {
        msg.channel.send('', {
            embed: {
                title: 'Úneme a tu server',
                url: `https://discordapp.com/oauth2/authorize?client_id=${appId}&scope=bot`
            }
        })
    }
}
