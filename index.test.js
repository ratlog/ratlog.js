import https from 'https'
import fs from 'fs'
import path from 'path'
import pump from 'pump'
import test from 'ava'
import ratlog from './index'

const testsuiteURL = 'https://raw.githubusercontent.com/ratlog/ratlog.github.io/master/ratlog.testsuite.json'
const specFile = path.join(__dirname, 'spec.json')

let testcases

function loadTestcases (cb) {
  fs.readFile(specFile, 'utf8', (err, contents) => {
    if (err) return cb(err)
    testcases = JSON.parse(contents).generic
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

test.serial(`testing spec.json cases correctly`, t => {
  t.plan(testcases.length)

  testcases.forEach(({data, log}) => {
    const write = line => {
      t.is(line, log, 'Input:\n\n' + JSON.stringify(data, null, 2))
    }
    const l = ratlog({write})
    l(data.message, data.fields, ...(data.tags || []))
  })
})

test('initial tag', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[tag|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}, 'tag')

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('tags only', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[x|y] msg\n')
  }

  const l = ratlog({write})
  l('msg', 'x', 'y')
})

test('one tag only', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[tag] msg\n')
  }

  const l = ratlog({write})

  l('msg', 'tag')
})

test('.tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[a|b|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}).tag('a', 'b')

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('.tag().tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[1|2|3|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}).tag(1).tag('2', 3)

  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('tag data', t => {
  t.plan(2)

  const message = 'hey\nhey'
  const tags = ['x', 'y']
  const fields = { a: 1, b: 2, c: undefined }

  const write = (line, data) => {
    t.is(line, '[x|y] hey\\nhey | a: 1 | b: 2 | c\n')
    t.deepEqual(data, {
      message,
      tags,
      fields
    })
  }

  const l = ratlog({write})

  l(message, fields, ...tags)
})
