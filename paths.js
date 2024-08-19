import { nanoid } from 'nanoid'

const baseDirectory =  '/Users/leandrinux/Desktop/mediabase'

export default {

    getBasePath: () => { 
        return baseDirectory
    },

    getDatabasePath: () => { 
        return baseDirectory
    },

    getTemporaryPath: () => {
        return `${baseDirectory}/temp`
    },

    getMediaPath: () => {
        return `${baseDirectory}/media`
    },

    getFullMediaPath: (media) => {
        return `${baseDirectory}/media/${media.file_path}/${media.file_name}`
    },

    getPreviewsPath: () => {
        return `${baseDirectory}/previews`
    },

    getFullPreviewPath: (media, animated) => {
        const mediaFilenameNoExtension = media.file_name.replace(/\.[^/.]+$/, "")
        const mediaFilename = mediaFilenameNoExtension.concat((animated) ? '.gif' : '.jpg') 
        return `${baseDirectory}/previews/${media.file_path}/${mediaFilename}`
    },

    getRandomTempFilePath: () => {
        return `${baseDirectory}/temp/${nanoid()}`
    }

}