const sankakuLink = require('../util/sankaku_link')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')

module.exports = {
    name: 'sankaku',
    nsfw: true,
    run: _async ((msg, args) => {
        const tags = args.join('+')
        const {img, link, suggestions} = _await (sankakuLink(tags))
        if (suggestions) {
            const render = sug => `${sug.tag} (${sug.qty})`
            const opts = '```\n  ' + suggestions.map(render).join('\n  ') + '```'
            msg.channel.send('Tal vez quisiste decir:\n' + opts)
            return
        }
        msg.channel.send(link, {
            embed: {
                image: {
                    url: img
                },
                footer: {
                    text: 'Desde sankakucomplex',
                    'icon_url': 'https://images.sankakucomplex.com/gfx/favicon.png'
                },
                url: link
            }
        })
    })
}
