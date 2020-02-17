const https = require('https')
const fs = require('fs')
const path = require('path')
const pump = require('pump')
const test = require('ava')
const ratlog = require('./index')

const testsuiteURL =
  'https://raw.githubusercontent.com/ratlog/ratlog-spec/master/ratlog.testsuite.json'
const specFile = path.join(__dirname, 'spec.json')

let testcases
let parserTests

function loadTestcases (cb) {
  fs.readFile(specFile, 'utf8', (err, contents) => {
    if (err) return cb(err)
    const cfg = JSON.parse(contents)
    testcases = cfg.generic
    parserTests = [...cfg.parsing, ...cfg.generic]
    cb()
  })
}

test.serial.before.cb('ensure spec.json exists', t => {
  fs.stat(specFile, err => {
    if (!err) return loadTestcases(t.end)
    console.log('downloading spec.json ...')
    https.get(testsuiteURL, res => {
      pump(res, fs.createWriteStream(specFile), () => {
        console.log('download done.')
        loadTestcases(t.end)
      })
    })
  })
})

test.serial('testing spec.json output cases correctly', t => {
  t.plan(testcases.length)

  testcases.forEach(({ data, log }) => {
    const write = line => {
      t.is(line, log, 'Input:\n\n' + JSON.stringify(data, null, 2))
    }
    const l = ratlog(write)
    l(data.message, data.fields, ...(data.tags || []))
  })
})

test.serial('testing spec.json parsing cases', t => {
  t.plan(parserTests.length)

  parserTests.forEach(({ data, log }) => {
    const parsed = ratlog.parse(log)[0]
    t.deepEqual(data, parsed, 'Case:\n\n' + JSON.stringify({ log, data }))
  })
})

test('initial tag', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[tag|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog(write, 'tag')

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('tags only', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[x|y] msg\n')
  }

  const l = ratlog(write)
  l('msg', 'x', 'y')
})

test('one tag only', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[tag] msg\n')
  }

  const l = ratlog(write)

  l('msg', 'tag')
})

test('.tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[a|b|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog(write).tag('a', 'b')

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('.tag().tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[1|2|3|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog(write)
    .tag(1)
    .tag('2', 3)

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('transform using .logger()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[x|y] msg | a: 1 | b: 2 | c\n')
  }

  const transform = log =>
    write(
      ratlog.stringify({
        message: 'msg',
        tags: log.tags,
        fields: log.fields
      })
    )

  const l = ratlog.logger(transform)

  l('hey\nhey', { a: 1, b: 2, c: undefined }, ...'x', 'y')
})
