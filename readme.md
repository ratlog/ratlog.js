# 🐀 Ratlog JavaScript library

## Application Logging for Rats, Humans and Machines

[![Build Status](https://travis-ci.org/ratlog/ratlog.js.svg?branch=master)](https://travis-ci.org/ratlog/ratlog.js) [![npm](https://img.shields.io/npm/v/ratlog.svg)](https://www.npmjs.com/package/ratlog) [![GitHub last commit](https://img.shields.io/github/last-commit/ratlog/ratlog.js.svg)](https://github.com/ratlog/ratlog.js) [![GitHub issues](https://img.shields.io/github/issues/ratlog/ratlog.js.svg)](https://github.com/ratlog/ratlog.js/issues)

**Disclaimer:** *Ratlog is still beta status and might be subject to breaking changes. Beware that the API and format might change significantly. We will try our best to tag a stable release as soon as possible. [Leave feedback](https://github.com/ratlog/ratlog.js/issues) and help us get there faster!*


Ratlog.js is a JavaScript logging library that supports the [Ratlog logging format](https://github.com/ratlog/ratlog-spec).

The output is opinionated to be readable by rats, humans and machines.

The provided API is designed to be as simple to use as possible while providing you with all Ratlog semantics.
Each log line can consist of a **message**, **tags** and **fields** which provides you enough context to quickly understand what's happening in your system.

For an introduction, see [this article](https://jorin.me/ratlog-js-javascript-application-logging-for-rats-humans-and-machines/).
To learn more about the design and ideas behind the Ratlog spec, checkout [ratlog-spec](https://github.com/ratlog/ratlog-spec).

The Ratlog JavaScript provides Ratlog semantics and the Ratlog format but they can be used independent from each other:

If you only want to make use of the API semantics, you can create a logger using `ratlog.logger()` and use JSON or any other format as output.
This way you can combine Ratlog's logging semantics with your logging framework or service of choice.

For more have a look at the **[API Documentation](https://ratlog.github.io/ratlog.js/modules/_api_d_.html).**


## Getting started

Install the [ratlog](https://www.npmjs.com/package/ratlog) NPM package:

```
npm i ratlog
```

Starting logging:

```js
const ratlog = require('ratlog')
const log = ratlog(process.stdout)

log('hello world')
// => hello world

// Add fields
log('counting', { count: 1 })
// => counting | count: 1

// Add fields and a tag
log('counting', { count: -1 }, 'negative')
// => [negative] counting | count: -1

// Create another logger bound to a tag
const warn = log.tag('warning')

warn('disk space low')
// => [warning] disk space low

// Combine and nest tags any way you like
const critical = warn.tag('critical')

critical('shutting down all servers')
// => [warning|critical] shutting down all servers


// Create a mock logger while testing
const logHandler = jest.fn()
const testLog = ratlog(logHandler)
testLog('hi', 'info')
expect(logHandler).toBeCalledWith('[info] hi\n')
```

There are more **[examples](https://github.com/ratlog/ratlog.js/tree/master/examples)** to learn how you can use **tags** to provide context in your logs about different components of your system.


-------------

Thanks to [@wmhilton](https://github.com/wmhilton) for pointing this out:

You can color tags by combining Ratlog with [chalk](https://github.com/chalk/chalk):

```js
const warn = log.tag(chalk.red('warning'))
log('Normal log')
warn('Warning log')
```

![colored log tags](https://thepracticaldev.s3.amazonaws.com/i/zfjh59l1y3ivr0pryivd.PNG)


## Requirements

Node >= 8.0.0


## Development and Contributing

Feel free to open an [issue](https://github.com/ratlog/ratlog.js/issues) to ask questions or give feedback and make suggestions.

To contribute code, run `npm i` to setup your dev environment and before submitting a [Pull Request](https://github.com/ratlog/ratlog.js/pulls), make sure `npm t` is passing.


## License

[MIT](https://github.com/ratlog/ratlog.js/blob/master/license)
