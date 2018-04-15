import childProcess from 'child_process'
import path from 'path'
import {promisify} from 'util'
import test from 'ava'

const exec = promisify(childProcess.exec)

const examplesDir = path.join(__dirname, 'examples')

const examples = [
  { name: 'simple', out: 'hello world\n', err: '' },

  { name: 'component',
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

  { name: 'component-with-metrics',
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
  }
]

examples.forEach(example => {
  test(example.name, async t => {
    const examplePath = path.join(examplesDir, example.name + '.js')

    const {stdout, stderr} = await exec('node ' + examplePath)

    t.is(stdout, example.out)
    t.is(stderr, example.err)
  }
  )
})
