module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('OsuUsers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            discordId: {
                type: Sequelize.STRING,
                unique: true,
                validate: { isInt: true }
            },
            osuId: {
                type: Sequelize.STRING,
                validate: { isInt: true }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('OsuUsers')
    }
}
