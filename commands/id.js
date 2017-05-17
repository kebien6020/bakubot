module.exports = {
    name: 'id',
    run(msg) {
        msg.channel.send(`Your user id is ${msg.author.id}`)
    }
}
