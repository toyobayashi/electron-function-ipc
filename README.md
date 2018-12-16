# electron-function-ipc

## Usage

```js
// main process
const ipcMain = require('electron-function-ipc/main.js')

ipcMain.on('123', async function (e, rendererCallback) {
  console.log(rendererCallback.toString())
  console.log(rendererCallback.name)
  const returnFunction = await rendererCallback(function mainCallback(s) {
    console.log(s)
    throw new TypeError(s)
    // return s
  }) // return Promise
  console.log(returnFunction.toString())
  console.log(returnFunction.name)
  returnFunction('888')
})
```

```js
const ipcRenderer = require('electron-function-ipc/renderer')

ipcRenderer.send('123', async function rendererCallback(mainCallback) {
  console.log(mainCallback.toString())
  console.log(mainCallback.name)
  try {
    const s = await mainCallback('666') // return Promise
    console.log(s)
  } catch (err) {
    console.log(err)
  }

  return function returnFunction(a) {
    console.log(a)
  }
})
```

## Note

Function invoked in another process returns promise even if it is not an async function, so you can use async/await syntax.
