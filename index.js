import { Server } from './server.js'
import { initAI } from './tasks/AI.js'
import { initData } from './data/index.js'
import msg from './log.js'

msg.log('Preparing components before starting server')
await initData()
await initAI()
new Server().start(3000)