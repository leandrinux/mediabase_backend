import { Sequelize, DataTypes, sql } from '@sequelize/core'
import { SqliteDialect } from '@sequelize/sqlite3'
import paths from '../paths.js'
import msg from '../log.js'

var models = {}

export default models

export async function initModels() {

    const sequelize = new Sequelize({
        dialect: SqliteDialect,
        storage: `${paths.getDatabasePath()}/mediabase.sqlite`
    })

    models.Media = sequelize.define('Media', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sql.uuidV4, allowNull: false },
        file_name: { type: DataTypes.STRING, allowNull: false },
        file_path: { type: DataTypes.STRING, allowNull: false },
        mime_type: { type: DataTypes.STRING(30), allowNull: true },
        media_type: { type: DataTypes.STRING(10), allowNull: true },
        width: { type: DataTypes.INTEGER, allowNull: true },
        height: { type: DataTypes.INTEGER, allowNull: true },
        date: { type: DataTypes.DATE, allowNull: true },
        sha256: { type: DataTypes.STRING(64), allowNull: true }
    }, { })
    
    models.Tag = sequelize.define('Tag', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        count: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 }
    }, { })
        
    models.TagsPerMedia = sequelize.define('TagsPerMedia', {})
    models.Media.belongsToMany(models.Tag, { through: 'TagsPerMedia' })
    models.Tag.belongsToMany(models.Media, { through: 'TagsPerMedia' })

    models.QR = sequelize.define('QR', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
        mediaId: { type: DataTypes.UUID, allowNull: false },
        value: { type: DataTypes.STRING, allowNull: false }
    }, { })
    models.QR.belongsTo(models.Media)

    models.OCR = sequelize.define('OCR', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
        mediaId: { type: DataTypes.UUID, allowNull: false },
        words: { type: DataTypes.STRING, allowNull: false }
    }, { })
    models.OCR.belongsTo(models.Media)

    models.Location = sequelize.define('Location', {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
        mediaId: { type: DataTypes.UUID, allowNull: false },
        latitude: { type: DataTypes.DOUBLE, allowNull: true },
        longitude: { type: DataTypes.DOUBLE, allowNull: true }
    }, { })
    models.Location.belongsTo(models.Media)

    await sequelize.sync()
    msg.log(`Database initialized at ${sequelize.rawOptions.storage}`);
}