# Bakubot

Un bot para discord que usa discord.js para su framework.
Para agregarlo a tu server has click en [este link](https://discordapp.com/oauth2/authorize?client_id=312836448254689280&scope=bot).

## Hostea tu propio bakubot

Si quieres puedes hostear bakubot en tu computador.

Vas a necesitar [git](https://git-scm.com/downloads), [node.js](https://nodejs.org/en/download/) y tener una cuenta en Discord.

Clona el repo e instala las dependencias.

```sh
# cd a la carpeta que uses para este tipo de cosas
git clone https://github.com/kebien6020/bakubot
cd bakubot
npm install
```

Inicia sesión en [discord](https://discordapp.com/) y luego abre este link https://discordapp.com/developers/applications/me

Crea una nueva app y un bot para esta app. Basicamente los pasos son:

1. New Application
1. App Name: El nombre de tu bot (Puedes colocarle Bakubot o cualquier otro nombre)
1. Create Application
1. Create a Bot User
1. Yes, do it

Eso es, ya tienes tu bot. No cierres la pestaña, vamos a necesitar el Client ID y el Token.

Renombra el archivo config.json.example a config.json. El archivo contiene lo siguiente:

```json
{
    "key": "<your token here>",
    "appId": "<your client id here>",
    "ownerId": "<your user id here>"
}
```

En donde dice `<your token here>` coloca tu token (tienes que darle a click to reveal para verlo).
**El token es basicamente el usuario y contraseña del bot, no lo publiques en ningun lado**.

En donde dice `<your client id here>` coloca tu Client ID.

El ownerId es para indicarle a tu bot que tu eres su dueño y tendrás permiso para algunos comandos especiales.
Para saber tu id, completa el tutorial y enviale a Bakubot el comando `b.id`.

Ok ahora inicia tu bot.

```sh
npm start
```

Eso es todo, Bakubot es funcional ya puedes conseguir tu id y colocarla en config.json, Bakubot se reiniciará automáticamente al detectar el cambio.
