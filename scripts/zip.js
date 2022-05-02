const path = require('path')
const AdmZip = require('adm-zip')

const resolve = (dest) => path.join(__dirname, dest)
const distPath = resolve('../dist')

const zip = new AdmZip()
zip.addLocalFolder(distPath)
zip.writeZip(resolve('../dist/dist.zip'))
