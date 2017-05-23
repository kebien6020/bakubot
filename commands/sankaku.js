const sankakuSearch = require('../util/sankaku_search')
const sankakuAutosuggest = require('../util/sankaku_autosuggest')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')

module.exports = {
    name: 'sankaku',
    nsfw: true,
    run: _async ((msg, args) => {
        const tags = args.join('+')
        const images = _await (sankakuSearch(tags))
        if (images.length === 0) {
            const suggestions = _await (sankakuAutosuggest(args[0]))
            const render = sug => `${sug.tag} (${sug.qty})`
            const opts = '```\n  ' + suggestions.map(render).join('\n  ') + '```'
            msg.channel.send('Tal vez quisiste decir:\n' + opts)
            return
        }
        const [ image ] = images
        msg.channel.send(image.link, {
            embed: {
                image: {
                    url: image.img
                },
                footer: {
                    text: 'Desde sankakucomplex',
                    'icon_url': 'https://images.sankakucomplex.com/gfx/favicon.png'
                },
                url: images.link
            }
        })
    })
}
