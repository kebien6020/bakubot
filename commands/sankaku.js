const sankakuSearch = require('../util/sankaku_search')
const sankakuAutosuggest = require('../util/sankaku_autosuggest')
const makeEmbed = require('../util/sankaku_make_embed')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')

module.exports = {
    name: 'sankaku',
    nsfw: true,
    run: _async ((msg, args, cache) => {
        const tags = args.join('+')
        const images = _await (sankakuSearch(tags))

        // Fallback to autosuggest
        if (images.length === 0) {
            const suggestions = _await (sankakuAutosuggest(args[0]))
            const render = sug => `${sug.tag} (${sug.qty})`
            const opts = '```\n  ' + suggestions.map(render).join('\n  ') + '```'
            msg.channel.send('Tal vez quisiste decir:\n' + opts)
            return
        }

        // Send the image
        const [ image ] = images
        const thisMessage = _await (msg.channel.send(image.link, makeEmbed(image)))

        // Cache by author and channel, the search and the message for later edit
        const cacheId = msg.author.id + ',' + msg.channel.id
        cache.sankaku[cacheId] = {
            search: tags,
            currentImg: 0,
            currentPage: 1,
            message: thisMessage,
        }
    })
}
