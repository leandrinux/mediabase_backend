const { Sequelize, DataTypes } = require('@sequelize/core')
const { SqliteDialect } = require('@sequelize/sqlite3')

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: 'data.sqlite'
})

const Media = sequelize.define('media', {
    media_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    thumb: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    createDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    OCR: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // timestamps: false
})

exports.Models = {
    init: function () {
        console.log("Initializing database");
        sequelize.sync();
    },
    Media: Media
}