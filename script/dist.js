const path = require('path')
const shell = require('shelljs')
const AdmZip = require('adm-zip')

const resolve = (dest) => path.join(__dirname, dest)
const distPath = resolve('../dist')

shell.rm('-rf', distPath)
shell.mkdir(distPath)
shell.cp('-r', [
    resolve('../manifest.json'),
    resolve('../src'),
    resolve('../icons'),
    resolve('../_locales')
], distPath)

const zip = new AdmZip()
zip.addLocalFolder(distPath)
zip.writeZip(resolve('../dist/dist.zip'))
