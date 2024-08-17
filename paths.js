
const baseDirectory =  '/Users/leandrinux/Desktop/mediabase'

exports.paths = {

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

    getThumbnailsPath: () => {
        return `${baseDirectory}/thumbs`
    },

    getFullThumbnailPath: (media) => {
        const mediaFilenameNoExtension = media.file_name.replace(/\.[^/.]+$/, "")
        return `${baseDirectory}/thumbs/${media.file_path}/${mediaFilenameNoExtension}.jpg`
    }

}