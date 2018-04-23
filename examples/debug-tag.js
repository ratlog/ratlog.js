// Use a transform function to filter and manipulate the data being written.
//
// The example shows how you can ignore logs tagged with 'debug'
// unless the `DEBUG` env var is set.
const ratlog = require('../index')

const log = ratlog(
  process.stdout,
  log => process.env.DEBUG || !log.tags.includes('debug') ? log : null
)

log('log')

const debug = log.tag('debug')

debug('debugging only')
