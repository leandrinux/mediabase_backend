import { Sequelize, DataTypes, sql } from '@sequelize/core'
import { SqliteDialect } from '@sequelize/sqlite3'
import paths from '../paths.js'

const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: `${paths.getDatabasePath()}/mediabase.sqlite`
})

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.UUID, primaryKey: true, defaultValue: sql.uuidV4, allowNull: false
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
    media_type: {
        type: DataTypes.STRING(10), allowNull: true
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
    date: {
        type: DataTypes.DATE, allowNull: true
    },
    OCR: {
        type: DataTypes.STRING, allowNull: true
    }
}, { })

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false
    },
    name: {
        type: DataTypes.STRING, allowNull: false
    },
    count: {
        type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0
    }
}, { })

const TagsPerMedia = sequelize.define('TagsPerMedia', {})
Media.belongsToMany(Tag, { through: 'TagsPerMedia' })
Tag.belongsToMany(Media, { through: 'TagsPerMedia' })

const QR = sequelize.define('QR', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false
    },
    mediaId: {
        type: DataTypes.UUID, allowNull: false
    },
    value: {
        type: DataTypes.STRING, allowNull: false
    }
}, { })
QR.belongsTo(Media)

export default {

    init: async () => {
        console.log(`[ ] Initializing database at ${sequelize.rawOptions.storage}`);
        await sequelize.sync()
    },

    Media: Media,
    Tag: Tag,
    TagsPerMedia: TagsPerMedia,
    QR: QR
}