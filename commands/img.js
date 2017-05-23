const sankakuCmd = require('./sankaku')

module.exports = {
    name: 'img',
    run: (msg, args, cache) => {
        sankakuCmd.run(msg, args.concat(['rating:safe', 'order:random']), cache)
    }
}
