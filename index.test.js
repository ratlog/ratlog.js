import test from 'ava'
import testsuite from '../ratlog.github.io/ratlog.testsuite.json'
import ratlog from './index'

const cases = testsuite.generic

test(`logging all ${cases.length} cases correctly`, t => {
  t.plan(cases.length)

  cases.forEach(({data, log}) => {
    const write = line => {
      t.is(line, log, 'Input:\n\n' + JSON.stringify(data, null, 2))
    }
    const l = ratlog({write})
    l(data.message, data.fields, ...(data.tags || []))
  })
})

test('with initial tag', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[tag|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}, 'tag')
  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('with .tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[a|b|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}).tag('a', 'b')
  l('msg', { a: 1, b: 2 }, 'x', 'y')
})

test('with .tag().tag()', t => {
  t.plan(1)

  const write = line => {
    t.is(line, '[1|2|3|x|y] msg | a: 1 | b: 2\n')
  }

  const l = ratlog({write}).tag(1).tag('2', 3)
  l('msg', { a: 1, b: 2 }, 'x', 'y')
})
