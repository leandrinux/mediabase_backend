const level = 2

/*
    | Level # | log | dbg | success | warn | err |
    |---------|-----|-----|---------|------|-----|
    |    0    | no  | no  |   yes   |  no  | yes |
    |    1    | yes | no  |   yes   | yes  | yes |
    |    2    | yes | yes |   yes   | yes  | yes | 
*/

export default {

    log: (text) => {
        if (level > 0) console.log(`🔵 ${text}`)
    },

    dbg: (text) => {
        if (level > 1) console.log(`⚪️ ${text}`)
    },

    success: (text) => {
        console.log(`🟢 ${text}`)
    },

    warn: (text) => {
        if (level > 0) console.log(`🟡 ${text}`)
    },

    err: (text) => {
        console.log(`🔴 ${text}`)
    }

}