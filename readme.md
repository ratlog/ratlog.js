# 🐀 ratlog

[![Build Status](https://travis-ci.org/ratlog/ratlog.js.svg?branch=master)](https://travis-ci.org/ratlog/ratlog.js)


https://ratlog.github.io


## Disclaimer

ratlog is still alpha status most likely subject to breaking changes.
Beware that the API and format might change significantly.
We will try our best to tag a stable release as soon as possible.

## Getting started

```js
const log = require('ratlog')(process.stdout)
log('hello world')
// => hello world

log('counting', { count: 1 })
// => counting | count: 1
log('counting', { count: -1 }, 'negative')
// => [negative] counting | count: -1

const warn = log.tag('warning')
warn('disk space low')
// => [warning] disk space low
const critical = warn.tag('critical')
critical('shutting down all servers')
// => [warning|critical] shutting down all servers
```


## Requirements

Node >= 8.0.0


## Development and Contributing

Run `npm i` to setup your dev environment and before submitting a Pull Request, make sure `npm t` is passing.


## Licsense

[MIT](./license)
