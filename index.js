function ratlog (stream, ...initTags) {
  const initTagsAsStrings = initTags.map(t => formatTag(t))

  function log (message, fields, ...callTags) {
    const tags = [...initTagsAsStrings, ...callTags.map(t => formatTag(t))]

    const tagString = tags.length ? `[${tags.join('|')}] ` : ''
    const messageString = formatMessage(message)
    const fieldString = Object.entries(fields || {})
      .map(([k, v]) => `| ${formatField(k)}: ${formatField(v)}`)
      .join(' ')

    stream.write(tagString + messageString + (fieldString ? ' ' : '') + fieldString + '\n')
  }

  log.tag = function tag (...additionalTags) {
    return ratlog(stream, [...initTagsAsStrings, ...additionalTags])
  }

  return log
}

function formatTag (val) {
  return toString(val).replace(/[|\]]/g, '\\$&')
}

function formatMessage (val) {
  return toString(val).replace(/[|]]/g, '\\$&')
}

function formatField (val) {
  return toString(val).replace(/[|:]/g, '\\$&')
}

function toString (val) {
  if (typeof val === 'string') {
    return val
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
