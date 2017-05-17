module.exports = {
    name: 'say',
    run(msg, args) {
        console.log(args)
        msg.channel.send(args.join(' '))
        if (msg.deletable) msg.delete()
    }
}
