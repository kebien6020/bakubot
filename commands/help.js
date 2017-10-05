const helpMsg = `\`\`\`
Comandos

b.help                  Muestra este mensaje
b.wallpaper             Un wallpaper (que esperabas)
b.img  [busqueda]       Busca una imagen normal en sankaku
b.imgh [busqueda]       Busca una imagen nsfw en sankaku (solo nsfw)
b.sankaku [busqueda]    Busqueda exacta en sankaku y solo entrega ultima imagen
b.next                  Siguiente imagen de b.img, b.imgh o b.sankaku
b.prev                  Como b.next pero hacia atras
b.hentai                Imagen hentai (solo nsfw)
b.hstart [hr|med|min]   b.hentai cada cierto tiempo (solo nsfw)
b.hstop                 Detiene b.hstart (solo... ok ya se entiende)
b.meme [name [t1, t2]]  Genera un meme con memegen.link
b.baka                  B-Baka!
b.invite                Muestra el link para entrar a un server
b.say                   Decir un mensaje y borrar el comando
b.agree                 Estoy de acuerdo
b.sexy                  Dime lo sexy que soy
b.stalk                 Muestra mensajes borrados o editados en el canal actual
b.unstalk               Detiene stalkeo en el canal actual
\`\`\``

module.exports = {
    name: 'help',
    run(msg) {
        msg.channel.send(helpMsg)
    }
}
