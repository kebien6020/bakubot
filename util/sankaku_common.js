const { sankaku } = require('../config')

exports.authParams = {
    'login': sankaku.user,
    'password_hash': sankaku.hash,
    'appkey': sankaku.appkey,
}

exports.headers = {
    'User-Agent': 'SCChannelApp/2.5 (Android; black)',
}
