const { parseError } = require('./error-parser.js')

module.exports = function registerFunctionCallIpc (functionMap, ipc, channel, wrapper) {
  ipc.on(channel, function (e, functionId, callId, ...args) {
    let returnValue
    const webContents = wrapper ? wrapper(e.sender, functionMap) : ipc
    try {
      returnValue = functionMap.get(functionId)(...args)
      if (Object.prototype.toString.call(returnValue) === '[object Promise]') {
        returnValue
          .then((res) => webContents.send(callId, null, res))
          .catch(err => webContents.send(callId, parseError(err)))
      } else {
        webContents.send(callId, null, returnValue)
      }
    } catch (err) {
      webContents.send(callId, parseError(err))
    }
  })
}
