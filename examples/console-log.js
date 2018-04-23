// You can even user console.log instead of process.stdout.
// This would also work in a browser.
//
// Just watch out to not get double trailing new-lines.
const ratlog = require('../index')

const log = ratlog(s => console.log(s.trim()))

log('hello world')
