import path from 'path'
import AdmZip from 'adm-zip'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../../dist')

const zip = new AdmZip()
zip.addLocalFolder(distPath)
zip.writeZip(path.join(distPath, 'dist.zip'))
