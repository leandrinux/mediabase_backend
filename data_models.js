const { Sequelize, DataTypes } = require('@sequelize/core')
const { SqliteDialect } = require('@sequelize/sqlite3')

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: 'mediabase.sqlite'
})

const Media = sequelize.define('media', {
    media_id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false
    },
    file_name: {
        type: DataTypes.STRING, allowNull: false
    },
    file_path: {
        type: DataTypes.STRING, allowNull: false
    },
    mime_type: {
        type: DataTypes.STRING(30), allowNull: true
    },
    width: {
        type: DataTypes.INTEGER, allowNull: true
    },
    height: {
        type: DataTypes.INTEGER, allowNull: true
    },
    latitude: {
        type: DataTypes.DOUBLE, allowNull: true
    },
    longitude: {
        type: DataTypes.DOUBLE, allowNull: true
    },
    creation_date: {
        type: DataTypes.STRING, allowNull: true
    },
    OCR: {
        type: DataTypes.STRING, allowNull: true
    }
}, { })

exports.Models = {

    initDatabase: async () => {
        await sequelize.sync();
    },

    Media: Media
}