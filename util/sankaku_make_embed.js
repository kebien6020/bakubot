
module.exports = function sankakuMakeEmbed(image) {
    return {
        embed: {
            image: {
                url: image.img
            },
            footer: {
                text: 'Desde sankakucomplex',
                'icon_url': 'https://images.sankakucomplex.com/gfx/favicon.png'
            },
            url: image.link
        }
    }
}
