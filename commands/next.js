const nextPrev = require('../util/next_prev')

module.exports = {
    name: 'next',
    run: (msg, _, cache) => nextPrev(msg, cache)
}
