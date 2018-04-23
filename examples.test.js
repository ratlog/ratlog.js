import childProcess from 'child_process'
import path from 'path'
import {promisify} from 'util'
import test from 'ava'

const exec = promisify(childProcess.exec)

const examplesDir = path.join(__dirname, 'examples')

const examples = [
  { name: 'simple', out: 'hello world\n', err: '' },

  { name: 'console-log', out: 'hello world\n', err: '' },

  {
    name: 'component',
    out:
`app starting
[counter] starting
[counter] started
app ready
[counter|event] counting | count: 1
[counter|event] counting | count: 2
[counter] stopped
app shutting down
`,
    err: ''
  },

  {
    name: 'component-with-metrics',
    out:
`app starting
[counter] starting
[counter] started
app ready
[counter|event] counting | count: 1
[counter|event] counting | count: 2
[counter] stopped
app shutting down
`,
    err:
`count = 1
count = 3
`
  },

  { name: 'debug-tag', out: 'log\n', err: '' },

  {
    name: 'debug-tag',
    out: 'log\n[debug] debugging only\n',
    err: '',
    env: { DEBUG: true }
  }
]

examples.forEach(example => {
  test(example.name, async t => {
    const examplePath = path.join(examplesDir, example.name + '.js')
    const options = { env: { ...process.env, ...example.env } }
    const {stdout, stderr} = await exec('node ' + examplePath, options)

    t.is(stdout, example.out)
    t.is(stderr, example.err)
  }
  )
})

test('TypeScript typings', async t => {
  const out =
`msg
msg | count: 2 | path: /
[a|b] msg
[tag] msg
[tag] msg
[a|b] msg
[tag] msg
[scope] msg
`
  const examplePath = path.join(examplesDir, 'typings.ts')

  const {stdout, stderr} = await exec('ts-node --typeCheck ' + examplePath)

  t.is(stdout, out)
  t.is(stderr, '')
}
)
