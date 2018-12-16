const { ipcRenderer } = require('electron')
const { RENDERER_CALL, MAIN_CALL } = require('./constant.js')
const registerFunctionCallIpc = require('./function-call.js')
const { overwriteWebContentsSend, overwriteIpcOn } = require('./overwrite.js')

const functionMap = new Map()

overwriteWebContentsSend(ipcRenderer, functionMap)

overwriteIpcOn(ipcRenderer, functionMap, MAIN_CALL)

registerFunctionCallIpc(functionMap, ipcRenderer, RENDERER_CALL)

module.exports = ipcRenderer
