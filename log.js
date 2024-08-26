const enableDebug = false

export default {

    log: (text) => {
        console.log(`💭 ${text}`)
    },

    dbg: (text) => {
        if (enableDebug) console.log(`🔍 ${text}`)
    },

    success: (text) => {
        console.log(`✅ ${text}`)
    },

    warn: (text) => {
        console.log(`❗️ ${text}`)
    },

    err: (text) => {
        console.log(`❌ ${text}`)
    }

}