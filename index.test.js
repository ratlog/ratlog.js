import test from 'ava'
import ratlog from './index'

const cases = [
  [
    ['hi'],
    'hi'
  ],
  [
    ['count', { count: 1 }],
    'count | count: 1'
  ],
  [
    ['counting event', { event: 'one', count: 1 }],
    'counting event | event: one | count: 1'
  ],
  [
    ['counting event', { event: 'one', count: 1 }, 'event'],
    '[event] counting event | event: one | count: 1'
  ],
  [
    ['counting event', { event: 'one', count: 1 }, 'event', 'count'],
    '[event|count] counting event | event: one | count: 1'
  ]
]

const tagCases = [
  [
    ['hi'],
    '[tag] hi'
  ],
  [
    ['count', { count: 1 }],
    '[tag] count | count: 1'
  ]
]

test(`logging all ${cases.length} cases correctly`, t => {
  t.plan(cases.length)

  cases.forEach(([input, output]) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write})
    log(...input)
  })
})

test(`${tagCases.length} cases for tagging on init`, t => {
  t.plan(tagCases.length)

  tagCases.forEach(([input, output]) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write}, 'tag')
    log(...input)
  })
})

test(`${tagCases.length} cases for tagging with .tag()`, t => {
  t.plan(tagCases.length)

  tagCases.forEach(([input, output]) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write}).tag('tag')
    log(...input)
  })
})
