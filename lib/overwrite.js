const { createFunction, parseFunction } = require('./function-parser.js')
const generateObjectId = require('./object-id.js')

exports.overwriteWebContentsSend = function overwriteWebContentsSend (webContents, functionMap) {
  const oldSend = webContents.send

  webContents.send = function (channel, ...args) {
    const nativeArgs = []
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'function') {
        nativeArgs.push(parseFunction(functionMap, args[i]))
      } else {
        nativeArgs.push(args[i])
      }
    }
    oldSend.call(this, channel, ...nativeArgs)
  }

  return webContents
}

exports.overwriteIpcOn = function overwriteIpcOn (ipc, functionMap, callbackChannel, wrapper) {
  const oldOn = ipc.on

  ipc.on = function (channel, listener) {
    oldOn.call(this, channel, function (e, ...args) {
      const newArgs = []
      for (let i = 0; i < args.length; i++) {
        if (Object.prototype.toString.call(args[i]) === '[object Object]' && generateObjectId.isObjectId(args[i].__id__) && args[i].hasOwnProperty('__name__') && args[i].hasOwnProperty('__string__')) {
          const fn = createFunction(args[i], ipc, wrapper ? wrapper(e.sender, functionMap) : ipc, callbackChannel)
          newArgs.push(fn)
        } else {
          newArgs.push(args[i])
        }
      }
      listener.call(this, e, ...newArgs)
    })
  }

  return ipc
}
