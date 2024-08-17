
const baseDirectory =  '/Users/leandrinux/Desktop'

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
        return `${baseDirectory}/thumbs/${media.file_path}/${media.file_name}`
    }

}