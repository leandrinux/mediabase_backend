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
    },
    thumb: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    timestamps: false
})

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

exports.Photo = Photo
exports.Exif = Exif
