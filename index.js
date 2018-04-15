function ratlog (stream, ...initTags) {
  function log (message, fields, ...callTags) {
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
  }

  log.tag = function tag (...additionalTags) {
    return ratlog(stream, ...[...initTags, ...additionalTags])
  }

  return log
}

function formatTag (val) {
  return toString(val).replace(/[|\]]/g, '\\$&')
}

function formatMessage (val) {
  return toString(val).replace(/[|[]/g, '\\$&')
}

function formatField (val) {
  return toString(val).replace(/[|:]/g, '\\$&')
}

function toString (val) {
  if (typeof val === 'string') {
    return val
  }

  if (val == null) {
    return ''
  }

  try {
    return val.toString()
  } catch (e) {
    try {
      return 'logger failed calling .toString(): ' + e.toString()
    } catch (e) {
      return ''
    }
  }
}

module.exports = ratlog
// For Typescript and other ES modules use cases
module.exports.default = ratlog
