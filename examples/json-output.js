// Use a custom logger to print JSON instead of using the Ratlog format.
const ratlog = require('../index')

const log = ratlog.logger(log => {
  process.stdout.write(JSON.stringify(log) + '\n')
})

log('log')

const debug = log.tag('debug')

debug('debugging only')
