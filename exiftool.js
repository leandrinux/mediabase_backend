import util from 'node:util'
import { exec } from 'node:child_process'
const execute = util.promisify(exec)

function camelize(str) {
    if (str.length == 0) return ""
    var words = str.split(' ')
    if (words.count == 1) return words[0].toLowercase
    const [ first ] = words.splice(0, 1)
    var result = words.reduce( (acc, word) => {
        if (word.length == 0) return acc
        return acc + word[0].toUpperCase() + word.substring(1, word.length).toLowerCase()
    }, first.toLowerCase())
    return result
}

function convertExifDate(dateStr) {
    const dateRegEx = /^(?<yearStr>\d+):(?<monthStr>\d+):(?<dayStr>\d+) (?<hourStr>\d+):(?<minutesStr>\d+):(?<secondsStr>\d+)(\.\d+)?(?<tz>(\-|\+)\d{2}:\d{2})?/gm
    const tzRegEx = /^(?<tzhour>(-|\+)\d+)(:(?<tzmin>\d+))?/gm
    var result = dateRegEx.exec(dateStr)
    if (!result) return
    const {yearStr, monthStr, dayStr, hourStr, minutesStr, secondsStr, tz} = result.groups
    var month = parseInt(monthStr, 10)
    var hour = parseInt(hourStr, 10)
    var minutes = parseInt(minutesStr, 10)
    if (tz) {
        const {tzhour, tzmin} = tzRegEx.exec(tz).groups
        hour = hour + parseInt(tzhour, 10)
        minutes = minutes + parseInt(tzmin, 10)
    }
    const date = new Date(yearStr, month+1, dayStr, hour, minutes, secondsStr)
    return date
}

function convert(str) {
    const number = Number(str)
    if (!isNaN(number)) return number
    const date = convertExifDate(str)
    if (date) return date
    return str
}

export default {

    run: async (filePath) => {
        const { stdout, stderr } = await execute(`exiftool ${filePath}`)
        const lines = stdout.split('\n')
        var result = {}
        lines.forEach(line => {
            var [ key, value ] = line.split(': ')
            if (key.length == 0) return
            result[camelize(key)] = convert(value)
        })
        return result
    }

}