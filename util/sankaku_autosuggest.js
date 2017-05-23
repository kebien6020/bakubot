const fetchJson  = require('./fetch_json')
const makeParams = require('./make_params')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')
const { headers } = require('./sankaku_common')

const url = 'https://cas.sankakucomplex.com/tag/autosuggest'

const sankakuAutosuggest = _async ((tag) => {
    // Suggest a search based on autosuggest
    const params = makeParams({tag})
    const data = _await (fetchJson(url + params, { headers }))
    const suggestions = []
    for (let i = 0; i < data[1].length; ++i)
        suggestions.push({
            tag: data[1][i],
            qty: data[i+2]
        })

    return suggestions
})

module.exports = sankakuAutosuggest
