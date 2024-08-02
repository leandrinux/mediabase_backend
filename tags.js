const { data } = require('./data.js');


exports.tags = {

    autoTag: async (mediaId) => {
        const media = await data.getMedia(mediaId)
        const creationDate = Date(media.date)
        console.log(creationDate)
        console.log(media.date)

        const formatter = new Intl.DateTimeFormat('en', { })
        try {
            const date = formatter.format(media.date)
            console.log(date)    
        } catch (error) {

        }
    }

}