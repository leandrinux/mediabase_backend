import msg from '../log.js'
import data from '../data/index.js'

export default async function autoTag(media) {
    
    const year = media.date.getFullYear().toString()
    data.addTagToMedia(year, media)

    const monthName = media.date.toLocaleString('default', { month: 'long' });
    data.addTagToMedia(monthName.toLowerCase(), media)

    msg.log('Autotagged successfully')
}