const helpMsg = `\`\`\`
Comandos

b.help                  Muestra este mensaje
b.wallpaper             Un wallpaper (que esperabas)
b.hentai                Imagen hentai (solo nsfw)
b.hstart [hr|med|min]   b.hentai cada cierto tiempo (solo nsfw)
b.hstop                 Detiene b.hstart (solo... ok ya se entiende)
b.meme [name [t1, t2]]  Genera un meme con memegen.link
b.baka                  B-Baka!
b.invite                Muestra el link para entrar a un server
b.say                   Decir un mensaje y borrar el comando
b.agree                 Estoy de acuerdo
b.sexy                  Dime lo sexy que soy
\`\`\``

module.exports = {
    name: 'help',
    run(msg) {
        msg.channel.send(helpMsg)
    }
}
