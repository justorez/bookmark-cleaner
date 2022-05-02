const path = require('path')
const shell = require('shelljs')

const resolve = (dest) => path.join(__dirname, dest)
const distPath = resolve('../dist')

shell.rm('-rf', distPath)
