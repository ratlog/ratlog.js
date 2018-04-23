// Implement your own writer wrapping process.stdout.
// By doing so you can filter and manipulate the data being written.
//
// The example shows how you can ignore logs tagged with 'debug'
// unless the `DEBUG` env var is set.
const ratlog = require('../index')

const log = ratlog({
  write: (logLine, logData) => {
    if (process.env.DEBUG || !logData.tags.includes('debug')) {
      process.stdout.write(logLine)
    }
  }
})

log('log')

const debug = log.tag('debug')

debug('debugging only')
