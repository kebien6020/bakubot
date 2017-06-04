module.exports = {
    name: 'roll',
    run(msg, args) {
        if (args.length > 0) {
            msg.channel.send('😡 No seas tramposo ' + msg.author)
        } else {
            const num = Math.floor(Math.random() * 100) + 1
            msg.channel.send(msg.author + ' saca ' + String(num))
        }
    }
}
