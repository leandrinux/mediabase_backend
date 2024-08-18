
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

    getFullPreviewPath: (media) => {
        const mediaFilenameNoExtension = media.file_name.replace(/\.[^/.]+$/, "")
        return `${baseDirectory}/previews/${media.file_path}/${mediaFilenameNoExtension}.jpg`
    }

}