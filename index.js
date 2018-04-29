const createLogFn = (initTags, handle) => (message = '', fields = {}, ...callTags) => {
  if (typeof fields === 'string') {
    return handle({
      message,
      tags: [...initTags, fields, ...callTags],
      fields: {}
    })
  }
  return handle({
    message,
    tags: [...initTags, ...callTags],
    fields
  })
}

const getWriteFn = writer => writer.write ? writer.write.bind(writer) : writer

const raw = (writer, ...initTags) => {
  const logFn = createLogFn(initTags, getWriteFn(writer))

  const tag = (...additionalTags) => raw(writer, ...initTags, ...additionalTags)

  return Object.assign(logFn, { tag })
}

const createLogger = handle => (writer, transform, ...initTags) => {
  const writeFn = getWriteFn(writer)

  if (transform == null) {
    return handle(writeFn, x => x, initTags)
  }

  if (typeof transform !== 'function') {
    return handle(writeFn, x => x, [transform, ...initTags])
  }

  return handle(writeFn, transform, initTags)
}

const logger = createLogger((write, transform, initTags) => {
  const logFn = createLogFn(initTags, data => {
    const transformed = transform(data)
    if (transformed) {
      write(stringify(transformed))
    }
  })

  const tag = (...additionalTags) => ratlog(write, transform, ...initTags, ...additionalTags)

  return Object.assign(logFn, { tag })
})

const ratlog = Object.assign(logger, { raw, stringify })

function stringify ({ tags, message, fields }) {
  const joinedTags = tags.map(formatTag).join('|')
  const tagString = joinedTags && `[${joinedTags}] `

  const messageString = formatMessage(message)

  const fieldString = Object.entries(fields || {})
    .map(([k, v]) => {
      const key = formatField(k)
      const value = formatField(v)
      return ` | ${key}${value && ': ' + value}`
    }
    )
    .join('')

  return tagString + messageString + fieldString + '\n'
}

const formatTag = val => toString(val).replace(/[|\]]/g, '\\$&')
const formatMessage = val => toString(val).replace(/[|[]/g, '\\$&')
const formatField = val => toString(val).replace(/[|:]/g, '\\$&')
const escapeNewLines = val => val.replace(/\n/g, '\\n')

function toString (val) {
  if (val == null) {
    return ''
  }

  if (typeof val === 'string') {
    return escapeNewLines(val)
  }

  try {
    return escapeNewLines(val.toString())
  } catch (e) {
    try {
      return 'logger failed calling .toString(): ' + escapeNewLines(e.toString())
    } catch (e) {
      return ''
    }
  }
}

module.exports = ratlog
// For Typescript and other ES module use cases
module.exports.default = ratlog
