const {async: _async, await: _await} = require('asyncawait')

module.exports = {
    name: 'top',
    run: _async ((msg) => {
        const topMember = msg.guild.members.random()
        const topUsername = topMember.nickname || topMember.user.username
        const text = `El top 1 es \`${topUsername}\``

        const botMsg = _await (msg.channel.send(text))

        if (topMember.user.id !== msg.author.id)
            setTimeout(() => {
                botMsg.edit(text + ' (no tu)')
            }, 2000)

    })
}
