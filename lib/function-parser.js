const generateObjectId = require('./object-id.js')
const { createError } = require('./error-parser.js')

exports.parseFunction = function parseFunction (functionMap, fn) {
  if (functionMap.has(fn)) {
    return {
      __id__: functionMap.get(fn),
      __name__: fn.name,
      __string__: fn.toString()
    }
  }

  const id = generateObjectId()
  functionMap.set(id, fn).set(fn, id)

  return {
    __id__: id,
    __name__: fn.name,
    __string__: fn.toString()
  }
}

exports.createFunction = function createFunction (fnObj, ipc, webContents, channel) {
  const fn = function (...argv) {
    const isNew = !!new.target

    return new Promise((resolve, reject) => {
      const callId = generateObjectId()
      ipc.once(callId, (_e, err, returnValue) => {
        if (err) {
          reject(createError(err))
          return
        }
        resolve(returnValue)
      })
      webContents.send(channel, fnObj.__id__, callId, isNew, ...argv)
    })
  }
  Object.defineProperties(fn, {
    name: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: fnObj.__name__
    },
    toString: {
      configurable: true,
      writable: true,
      enumerable: false,
      value () {
        return fnObj.__string__
      }
    }
  })

  return fn
}
