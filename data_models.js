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
    latitude: {
        type: DataTypes.DOUBLE, allowNull: true
    },
    longitude: {
        type: DataTypes.DOUBLE, allowNull: true
    },
    media_creation_date: {
        type: DataTypes.STRING, allowNull: true
    },
    OCR: {
        type: DataTypes.STRING, allowNull: true
    }
}, { })

exports.Models = {
    init: function () {
        console.log("Initializing database");
        sequelize.sync();
    },
    Media: Media
}