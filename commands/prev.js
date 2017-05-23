const nextPrev = require('../util/next_prev')

module.exports = {
    name: 'prev',
    run: (msg, _, cache) => nextPrev(msg, cache, true)
}
