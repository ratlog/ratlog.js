function ratlog (stream, ...initTags) {
  return Object.assign((message = '', fields = {}, ...callTags) => {
    if (typeof fields === 'string') {
      callTags = [fields, ...callTags]
      fields = {}
    }

    const tags = [...initTags, ...callTags]
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

    stream.write(tagString + messageString + fieldString + '\n', { message, tags, fields })
  }, {
    tag: (...additionalTags) => ratlog(stream, ...initTags, ...additionalTags)
  })
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
