const fetchJson  = require('./fetch_json')
const makeParams = require('./make_params')
const _async  = require('asyncawait/async')
const _await  = require('asyncawait/await')
const { authParams, headers } = require('./sankaku_common')

const url = 'https://capi.sankakucomplex.com/post/index.json'

const sankakuSearch = _async ((tags, limit = 1, page = 1) => {
    const params = makeParams(Object.assign(authParams, {tags, limit, page}))
    const data = _await (fetchJson(url + params, { headers }))
    return data.map(image => ({
        img: 'https:' + image.sample_url,
        link: 'https://chan.sankakucomplex.com/post/show/' + image.id
    }))
})

module.exports = sankakuSearch
