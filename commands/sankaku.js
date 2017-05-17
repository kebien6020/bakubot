const sankakuLink = require('../util/sankaku_link')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')

module.exports = {
    name: 'sankaku',
    nsfw: true,
    run: _async ((msg, args) => {
        const tags = args.join('+')
        const {img, link} = _await (sankakuLink(tags))
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
