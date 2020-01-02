const fs = require('fs')
const path = require('path')
const mimeType = require('mime-types')

let list = {}

function parse(file) {
  const filePath = path.resolve(file)
  const fileMimeType = mimeType.lookup(filePath)
  //   console.log(['image/png', 'image/jpeg'].includes(fileMimeType))
  if (['image/png'].includes(fileMimeType)) {
    const extension = path.extname(filePath)
    const filename = path.basename(filePath, extension)
    const bitmap = fs.readFileSync(filePath)
    const data = Buffer.from(bitmap, 'binary').toString('base64')
    const base64str = `data:${fileMimeType};base64,${data}`
    list[filename] = base64str
  }
}

function each(dir) {
  const p = fs.readdirSync(dir)
  p.forEach((item, index) => {
    const itemPath = path.resolve(`${dir}/${item}`)
    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      each(itemPath)
    } else {
      parse(itemPath)
    }
  })
}

const input = './'
fs.stat(input, (err, stats) => {
  if (stats.isFile()) {
    parse(input)
  } else if (stats.isDirectory()) {
    each(input)
  }

  fs.createWriteStream('./res.json').end(JSON.stringify(list), () => {
    console.log('success')
  })
})
