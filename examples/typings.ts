// Ratlog comes with Typescript typings and a default export
import ratlog from '../index'

const log = ratlog(process.stdout)

log('msg')
log('msg', { count: 2, path: '/' })
log.tag('a', 'b')('msg', null)

// Fields cannot be ommited but left empty
log('msg', null, 'tag')
log('msg', {}, 'tag')
log('msg', {}, 'a', 'b')

// But it is probably easier to read when using .tag() instead
log.tag('tag')('msg')

const scopedLog = log.tag('scope')
scopedLog('msg')
