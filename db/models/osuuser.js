module.exports = function(sequelize, DataTypes) {
    const OsuUser = sequelize.define('OsuUser', {
        discordId: DataTypes.STRING,
        osuId: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    })
    return OsuUser
}
