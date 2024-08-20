const enableDebug = false

export default {

    log: (text) => {
        console.log(`[ ] ${text}`)
    },

    dbg: (text) => {
        if (enableDebug) console.log(`[.] ${text}`)
    },

    warn: (text) => {
        console.log(`[!] Warning: ${text}`)
    },

    err: (text) => {
        console.log(`[X] Error: ${text}`)
    }

}