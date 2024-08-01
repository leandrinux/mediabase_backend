const { data } = require('./data.js');


exports.tags = {

    autoTag: async (mediaId) => {
        const media = await data.getMedia(mediaId)
        console.log(media)
        const creationDate = Date(media.creation_date)
        console.log(creationDate)
        console.log(media.creation_date)

        const formatter = new Intl.DateTimeFormat('en', { })
        try {
            const date = formatter.format(media.creation_date)
            console.log(date)    
        } catch (error) {

        }
    }

}