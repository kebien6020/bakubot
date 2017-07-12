const allowedCharsRe = /[a-z1-9 ]/
function normalize(str) {
    return str
        .toLowerCase()
        .split('')
        .filter(c => allowedCharsRe.test(c))
        .join('')
}

function normalCompare(str1, str2) {
    return normalize(str1) === normalize(str2)
}

function renderMember(member) {
    const nick = member.nickname !== null
               ? member.nickname
               : member.user.username
    const fullname = member.user.username + '#' + member.user.discriminator
    return `${nick} (${fullname})`
}

module.exports = {
    name: 'quienJuega',
    run(msg, args) {
        const askedGame = args.join(' ')
        const { members } = msg.guild

        const isPlaying = member => {
            if (member.presence.game === null) return false
            return normalCompare(member.presence.game.name, askedGame)
        }

        const playingAskedGame = members.filter(isPlaying)

        if (playingAskedGame.size > 0) {
            const message = '```'
                          + playingAskedGame.map(renderMember).join('\n')
                          + '```'
            msg.channel.send(message)
        } else {
            msg.channel.send('Nadie 🖕')
        }

    }
}
