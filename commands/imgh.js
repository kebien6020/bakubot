const sankakuCmd = require('./sankaku')

module.exports = {
    name: 'imgh',
    nsfw: true,
    run: (msg, args, cache) => {
        sankakuCmd.run(msg, args.concat(['-rating:safe', 'order:random']), cache)
    }
}
