function ratlog (stream, ...initTags) {
  return Object.assign((message, fields, ...callTags) => {
    const formattedTags = [...initTags, ...callTags].map(t => formatTag(t))

    const tagString = formattedTags.length ? `[${formattedTags.join('|')}] ` : ''

    const messageString = formatMessage(message)

    const fieldString = Object.entries(fields || {})
      .map(([k, v]) => {
        const value = formatField(v)
        return ` | ${formatField(k)}${value ? ': ' + value : ''}`
      })
      .join('')

    stream.write(tagString + messageString + fieldString + '\n')
  }, {
    tag: (...additionalTags) => ratlog(stream, ...[...initTags, ...additionalTags])
  })
}

const formatTag = (val) => toString(val).replace(/[|\]]/g, '\\$&')
const formatMessage = (val) => toString(val).replace(/[|[]/g, '\\$&')
const formatField = (val) => toString(val).replace(/[|:]/g, '\\$&')
const escapeNewLines = (val) => val.replace(/\n/g, '\\n')

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
// For Typescript and other ES modules use cases
module.exports.default = ratlog
