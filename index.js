import { Server } from './server.js'
import { initAI } from './tasks/AI.js'
import { initData } from './data/index.js'
import { initPaths } from './paths.js'
import msg from './log.js'


console.log('\n\
  __  __ ___ ___ ___   _   ___   _   ___ ___ \n\
 |  \\/  | __|   \\_ _| /_\\ | _ ) /_\\ / __| __|\n\
 | |\\/| | _|| |) | | / _ \\| _ \\/ _ \\\\__ \\ _|\n\
 |_|  |_|___|___/___/_/ \\_\\___/_/ \\_\\___/___|\n\
\n\
')

const port = process.env.PORT
if (!port) {
  msg.err('You must set an environment variable file')
} else {
  msg.log('Preparing components before starting server')
  initPaths()
  await initData()
  await initAI()
  new Server().start(port)
}