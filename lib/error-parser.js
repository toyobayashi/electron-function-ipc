exports.parseError = function parseError (err) {
  const keys = Object.getOwnPropertyNames(err)
  let obj = {}
  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = err[keys[i]]
  }
  obj._constructor = err.constructor.name
  return obj
}

exports.createError = function createError (obj) {
  const g = typeof window === 'undefined' ? global : window
  const err = new g[obj._constructor]()
  delete obj._constructor

  for (let key in obj) {
    err[key] = obj[key]
  }

  return err
}
