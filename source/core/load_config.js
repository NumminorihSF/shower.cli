const fs = require('fs')
const { resolve } = require('path')
const { promisify } = require('util')

const { isExist } = require('../util/files')

/**
 * @typedef {Object} ProjectConfig
 * @property {string} project.path – Found an project
 * @property {Object} project.pkg – project package.json
 */

/**
 * @typedef {Object} AppConfig
 * @property {string} root – Path to the current project folder
 * @property {ProjectConfig|null} project – Existing project config
 */

/**
 * Checks if the 'path' directory is a shower project
 *
 * @param {string} path
 * @return {Promise<boolean>}
 */
async function isShowerProjectRoot (path) {
  try {
    return (await promisify(fs.stat)(resolve(path, 'index.html'))).isFile()
  } catch (_) {}

  return false
}

/**
 * Find shower project
 * @async
 * @private
 *
 * @param {string} path – the directory from which the script is run
 *
 * @return {string|null} – path to shower project if project exists else null
 */
async function findExistProject (path) {
  const searchLimit = process.env.HOME || '/'

  while (path !== searchLimit) {
    if (await isShowerProjectRoot(path)) {
      const project = { path }

      const pkgFile = resolve(project.path, 'package.json')
      if (isExist(pkgFile)) {
        project.pkg = require(pkgFile)
      }

      return project
    }

    path = resolve(path, '..')
  }

  return null
}

/**
 * Creates a application config
 * @async
 *
 * @param {string=$PWD} root – The directory from which the script is run
 *
 * @returns {AppConfig} – application config
 */
async function loadConfig (root = process.env.PWD) {
  const project = await findExistProject(root)

  return {
    root,
    project
  }
}

module.exports = loadConfig
