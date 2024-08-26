import { nanoid } from 'nanoid'
import { homedir } from 'os'
import msg from './log.js'

var baseDirectory

export function initPaths() {
    var args = process.argv.slice(2)
    if (args.length == 1) {
        // use the specified directory
        baseDirectory = args[0]
    } else {
        // get the home directory, then set it on a desktop folder
        const home = homedir()
        baseDirectory =  `${home}/Desktop/mediabase`
    }
    msg.success(`Base directory set to ${baseDirectory}`)
}

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
        const mediaFilename = mediaFilenameNoExtension.concat((animated) ? '.mp4' : '.jpg') 
        return `${baseDirectory}/previews/${media.file_path}/${mediaFilename}`
    },

    getRandomTempFilePath: () => {
        return `${baseDirectory}/temp/${nanoid()}`
    }

}