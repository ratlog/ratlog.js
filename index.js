const logger = (writer, ...initTags) => {
  const write = getWriteFn(writer)

  const logFn = (message = '', fields = {}, ...callTags) =>
    typeof fields === 'string'
      ? write({ message, tags: [...initTags, fields, ...callTags], fields: {} })
      : write({ message, tags: [...initTags, ...callTags], fields })

  const tag = (...additionalTags) => logger(writer, ...initTags, ...additionalTags)

  return Object.assign(logFn, { tag })
}

const ratlog = Object.assign((writer, ...initTags) => {
  const write = getWriteFn(writer)
  return logger(log => write(stringify(log)), ...initTags)
}, { logger, stringify })

const getWriteFn = writer => writer.write ? writer.write.bind(writer) : writer

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
