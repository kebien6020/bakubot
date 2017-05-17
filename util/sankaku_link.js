const fetch  = require('node-fetch')
const objMap = require('./obj_map')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')
const { sankaku } = require('../config')

const url = 'https://capi.sankakucomplex.com/post/index.json'
const suggestUrl = 'https://cas.sankakucomplex.com/tag/autosuggest'
const makeParams = obj =>
    '?' + objMap(obj, (key, val) => key + '=' + val).join('&')

const params = {
    'login': sankaku.user,
    'password_hash': sankaku.hash,
    'appkey': sankaku.appkey,
    'page': 1,
    'limit': 1,
}

const headers = {
    'User-Agent': 'SCChannelApp/2.5 (Android; black)'
}

const main = _async ((tags) => {
    const paramsTags = Object.assign(params, {tags})
    const response = _await (fetch(url + makeParams(paramsTags), { headers }))
    const data = _await (response.json())
    if (data.length === 0) {
        // Suggest a search based on autosuggest
        const params = makeParams({tag: tags.split('+')[0]})
        const response = _await (fetch(suggestUrl + params, { headers }))
        const data = _await (response.json())
        const suggestions = []
        for (let i = 0; i < data[1].length; ++i)
            suggestions.push({
                tag: data[1][i],
                qty: data[i+2]
            })

        return {suggestions}
    }
    return {
        img: 'https:' + data[0].sample_url,
        link: 'https://chan.sankakucomplex.com/post/show/' + data[0].id
    }
})

module.exports = function sankakuLink(tags) {
    return main(tags)
}
