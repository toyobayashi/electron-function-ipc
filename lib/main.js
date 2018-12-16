const { ipcMain } = require('electron')
const { RENDERER_CALL, MAIN_CALL } = require('./constant.js')
const registerFunctionCallIpc = require('./function-call.js')
const { overwriteWebContentsSend, overwriteIpcOn } = require('./overwrite.js')

const functionMap = new Map()

overwriteIpcOn(ipcMain, functionMap, RENDERER_CALL, overwriteWebContentsSend)

registerFunctionCallIpc(functionMap, ipcMain, MAIN_CALL, overwriteWebContentsSend)

module.exports = ipcMain
