const util = require("util");
const { Sequelize, DataTypes } = require('@sequelize/core')
const { SqliteDialect } = require('@sequelize/sqlite3')

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: 'data.sqlite'
})

const Photo = sequelize.define('photo', {
    photo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    file_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false
})

async function registerNewPhoto(filename) {
    return await Photo.create({
        file_name: filename
    })
}

const Exif = sequelize.define('exif', {
    exif_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    photo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
})

async function saveExifData(photo_id, data) {
    return await Exif.create({
        photo_id: photo_id,
        latitude: data.latitude,
        longitude: data.latitude
    })
}

exports.data = {
    registerNewPhoto: registerNewPhoto,
    saveExifData: saveExifData
}