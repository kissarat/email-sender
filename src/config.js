const ms = require('ms')
const { join } = require('path')

const { readDotEnv } = require('./utils/file')

const Mode = {
  Local: 'local',
  Dev: 'development',
  Test: 'test',
  Stage: 'stage',
  Prod: 'production'
}

const mode = process.env.NODE_ENV || process.env.ENV || Mode.Prod

if (Object.values(Mode).indexOf(mode) < 0) {
  throw new Error(`Invalid environment "${mode}"`)
}

const settings = {}

const config = {
  Mode,
  mode() {
    return mode
  },

  backendOrigin() {
    return config.get('BACKEND_ORIGIN', 'http://localhost:3000')
  },

  projectDir() {
    return join(__dirname, '..')
  },

  configDir() {
    return join(config.projectDir(), 'modes', config.mode())
  },

  sourceDir() {
    return join(config.projectDir(), 'src')
  },

  logDir() {
    return join(config.projectDir(), 'logs')
  },

  publicDir() {
    return join(config.projectDir(), 'public')
  },

  debug() {
    return config.getBoolean('DEBUG')
  },

  has(name) {
    return name in process.env || name in settings;
  },

  get(name, defaultValue) {
    if (name in process.env) {
      return process.env[name];
    }
    return name in settings
      ? settings[name]
      : defaultValue
  },

  getArray(name, defaultValue = '') {
    return config.get(name, defaultValue).split(',').filter((item, i, array) => i === array.indexOf(item));
  },

  getNumber(name, defaultValue) {
    const string = config.get(name, defaultValue)
    if (string) {
      const number = +string
      if (isFinite(number)) {
        return number
      } else {
        throw new Error(`Invalid number value "${string}" for environment variable "${name}"`)
      }
    }
  },

  getInteger(name, defaultValue) {
    const number = config.getNumber(name, defaultValue)
    if (Number.isInteger(number)) {
      return number
    }
    throw new Error(`Invalid integer value "${string}" for environment variable "${name}"`)
  },

  getPositiveInteger(name, defaultValue) {
    const integer = config.getNumber(name, defaultValue)
    if (integer >= 0) {
      return integer
    }
    throw new Error(`Invalid integer value "${string}" for environment variable "${name}"`)
  },

  getPort(name, defaultValue) {
    const integer = config.getPositiveInteger(name, defaultValue)
    if (integer < 2 ** 16) {
      return integer
    }
    throw new Error(`Invalid port number "${string}" for environment variable "${name}"`)
  },

  getBoolean(name, defaultValue) {
    const string = config.get(name, defaultValue)
    if (!string || string === '0') {
      return false
    }
    if (string === '1' || string === 'true') {
      return true
    }
    throw new Error(`Invalid boolean value "${string}" for environment variable "${name}"`)
  },

  getMilliseconds(name, defaultValue) {
    const value = config.get(name, defaultValue)
    return ms(value)
  },

  instanceId() {
    return config.getPositiveInteger('INSTANCE_ID', '0')
  }
}

Object.assign(
  settings,
  readDotEnv(join(config.configDir(), '.env')) || {},
  readDotEnv(join(config.projectDir(), '.env')) || {},
)

module.exports = config

Object.freeze(module.exports)
