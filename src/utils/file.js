const { readFileSync, lstatSync } = require('fs')

function readDotEnv(filename) {
  try {
    const string = readFileSync(filename, 'utf8').toString('utf8')
    const dict = {}
    let i = 0
    for (const line of string.split('\n')) {
      const [keyValue] = line.split('#')
      if (keyValue && keyValue.trim()) {
        const parts = keyValue.split('=').map(s => s.trim())
        if (parts.length < 2) {
          console.warn(`Invalid format in line ${i}: ${line}`)
        }
        dict[parts[0]] = parts.slice(1).join('=');
      }
      i++
    }
    return dict
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    console.warn(`File ${filename} not found`)
  }
}

const clearFileName = name => (name || '')
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/["'<>&:;/\\`]+/g, '')
const { readdirSync } = require('fs');
const { extname } = require('path')
const { parse, join } = require('path');

function readDirectoryModules(dir, allowFilename = () => true) {
  const modules = readdirSync(dir)
    .reduce((acc, filename) => {
      if ('.js' === extname(filename)) {
        const filelocation = join(dir, filename)
        if (allowFilename(filelocation)) {
          const fn = parse(filename)
          acc[fn.name] = require(filelocation)
        }
      }
      return acc
    }, {})
  return modules
}

function* readDirRecursive(dir, filePredicate, depth = 10) {
  if (depth <= 0) {
    throw new Error(`File hierarchy is too deep to read (depth ${depth})`)
  }
  for (const basename of readdirSync(dir)) {
    const filename = join(dir, basename)
    const stat = lstatSync(filename)
    if (filePredicate(filename, stat)) {
      if (stat.isFile()) {
        yield {
          path: filename,
          stat
        }
      } else if (stat.isDirectory()) {
        let i = 0
        for (const desc of readDirRecursive(filename, filePredicate, depth - 1)) {
          yield desc
          i++
        }
        if (i > 0) {
          return {
            stat,
            childrenCount: i,
            path: filename
          }
        }
      }
    }
  }
  const filenames = readdirSync(dir)
    .map(filename => join(dir, filename))
    .filter(filePredicate)
}

function readDirectories(dir, filePredicate = () => true) {
  const result = []
  for (const basename of readdirSync(dir)) {
    const filename = join(dir, basename)
    const stat = lstatSync(filename)
    if (filePredicate(filename, stat)) {
      result.push({
        path: filename,
        name: basename,
        stat
      })
    }
  }
  return result
}

module.exports = { readDotEnv, clearFileName, readDirectoryModules, readDirRecursive, readDirectories }
