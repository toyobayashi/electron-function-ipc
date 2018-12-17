const { parseError } = require('./error-parser.js')

module.exports = function registerFunctionCallIpc (functionMap, ipc, channel, wrapper) {
  ipc.on(channel, function (e, functionId, callId, isNew, ...args) {
    let returnValue
    const webContents = wrapper ? wrapper(e.sender, functionMap) : ipc
    try {
      const F = functionMap.get(functionId)
      returnValue = isNew ? new F(...args) : F(...args)
      if (Object.prototype.toString.call(returnValue) === '[object Promise]') {
        returnValue
          .then((res) => {
            if (res === undefined) {
              webContents.send(callId, null)
            } else {
              webContents.send(callId, null, res)
            }
          })
          .catch(err => webContents.send(callId, parseError(err)))
      } else {
        if (returnValue === undefined) {
          webContents.send(callId, null)
        } else {
          webContents.send(callId, null, returnValue)
        }
      }
    } catch (err) {
      webContents.send(callId, parseError(err))
    }
  })
}
