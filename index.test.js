import test from 'ava'
import cases from '../ratlog.github.io/ratloc.spec.json'
import ratlog from './index'

const tagCases = cases.filter(({input}) => input.initialTags)

test(`logging all ${cases.length} cases correctly`, t => {
  t.plan(cases.length)

  cases.forEach(({input, output}) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write})
    log(input.message, input.fields, ...(input.tags || []))
  })
})

test(`${tagCases.length} cases for tagging on init`, t => {
  t.plan(tagCases.length)

  tagCases.forEach(({input, output}) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write}, 'tag')
    log(input.message, input.fields, ...(input.tags || []))
  })
})

test(`${tagCases.length} cases for tagging with .tag()`, t => {
  t.plan(tagCases.length)

  tagCases.forEach(({input, output}) => {
    const write = line => {
      t.is(line, output + '\n')
    }
    const log = ratlog({write}).tag('tag')
    log(input.message, input.fields, ...(input.tags || []))
  })
})
