const fetch = require('isomorphic-fetch')

module.exports = function fetchJson(url, opts = {}) {
    const defaultOpts = {
        headers: {
            'Accept': 'application/json'
        }
    }
    const fullOpts = Object.assign(defaultOpts, opts)
    return fetch(url, fullOpts)
        .then(res => {
            if (!res.ok) throw 'Error while fetching ' + url
            return res.json()
        })
}
