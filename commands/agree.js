module.exports = {
    name: 'agree',
    run(msg) {
        msg.channel.send(`Sí, lo que ${msg.author} dijo`)
    }
}
