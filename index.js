const logger = (writer, ...initTags) => {
  const write = getWriteFn(writer)

  const logFn = (message = '', fields = {}, ...callTags) =>
    typeof fields === 'string'
      ? write({ message, tags: [...initTags, fields, ...callTags], fields: {} })
      : write({ message, tags: [...initTags, ...callTags], fields })

  const tag = (...additionalTags) =>
    logger(writer, ...initTags, ...additionalTags)

  return Object.assign(logFn, { tag })
}

const ratlog = Object.assign(
  (writer, ...initTags) => {
    const write = getWriteFn(writer)
    return logger(log => write(stringify(log)), ...initTags)
  },
  { logger, stringify }
)

const getWriteFn = writer => (writer.write ? writer.write.bind(writer) : writer)

function stringify ({ tags, message, fields }) {
  const joinedTags = tags.map(formatTag).join('|')
  const tagString = joinedTags && `[${joinedTags}] `

  const messageString = formatMessage(message)

  const fieldString = Object.entries(fields || {})
    .map(([k, v]) => {
      const key = formatField(k)
      const value = formatField(v)
      return ` | ${key}${value && ': ' + value}`
    })
    .join('')

  return tagString + messageString + fieldString + '\n'
}

const formatTag = val => toString(val).replace(/[|\]]/g, '\\$&')
const formatMessage = val => toString(val).replace(/[|[]/g, '\\$&')
const formatField = val => toString(val).replace(/[|:]/g, '\\$&')
const escapeNewLines = val => val.replace(/\n/g, '\\n')

function parse (logLines) {
  return logLines.split('\n').map(line => {
    const data = {} // Construct empty return object

    line = unescapeNewlines(line)

    // Parse tags (only exist if the first char is '[' )
    if (line.charAt(0) === '[') {
      const matches = line.match(/\[(.*(?<!\\))\]/) // Get all content inside the first non-escaped brackets

      data.tags = matches[1]
        .split(/(?<!\\)\|/g) // split by unescaped pipes
        .map(tag => unformatTag(tag.trim())) // Undo tag formatting

      line = line.substring(matches[0].length) // Cut off the tag segment
    }

    // Parse messages
    data.message = line.match(/.*?(?= \|)/)[0] // Match message if unescaped pipe symbol follows.
    if (data.message.length === 0) data.message = line // If no match, message is whole line.
    line = line.substring(data.message.length) // Cut off message segment
    data.message = unformatMessage(data.message) // Undo message formatting.

    // Parse fields
    try {
      if (line.length > 0) {
        data.fields = line
          .split(/(?<!\\) \| /g)
          .slice(1)
          .map(t => t.trim())
          .map(t => /(.*?)(?<!\\): (.*)/.exec(t))
          .reduce((accum, cur) => {
            accum[unformatField(cur[1])] = unformatField(cur[2])
            return accum
          }, {})
      }
    } catch (err) {
      data.message += line
    }

    return data
  })
}

const unformatTag = val => val.replace(/\\\|/g, '|').replace(/\\\]/g, ']')
const unformatMessage = val => val.replace(/\\\|/g, '|').replace(/\\\[/g, '[')
const unformatField = val => val.replace(/\\\|/g, '|').replace(/\\:/g, ':')
const unescapeNewlines = val => val.replace(/\\n/g, '\n')

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
      return (
        'logger failed calling .toString(): ' + escapeNewLines(e.toString())
      )
    } catch (e) {
      return ''
    }
  }
}

module.exports = ratlog
// For Typescript and other ES module use cases
module.exports.default = ratlog
