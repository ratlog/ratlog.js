function ratlog (stream, ...initTags) {
  const initTagsAsStrings = initTags.map(t => toString(t))

  function log (message, fields = {}, ...callTags) {
    const tags = [...initTagsAsStrings, ...callTags.map(t => toString(t))]

    const tagString = tags.length ? `[${tags.join('|')}] ` : ''
    const messageString = toString(message)
    const fieldString = Object.entries(fields)
      .map(([k, v]) => `| ${toString(k)}: ${toString(v)}`)
      .join(' ')

    stream.write(tagString + messageString + (fieldString ? ' ' : '') + fieldString + '\n')
  }

  log.tag = function tag (...additionalTags) {
    return ratlog(stream, [...initTags, ...additionalTags])
  }

  return log
}

function toString (val) {
  if (typeof val === 'string') {
    return val
  }
  try {
    return val.toString()
  } catch (e) {
    try {
      return e.toString()
    } catch (e) {
      return ''
    }
  }
}

module.exports = ratlog
