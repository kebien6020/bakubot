module.exports = {
    name: 'say',
    run(msg, args) {
        msg.channel.send(args.join(' '))
        if (msg.deletable) msg.delete()
    }
}
