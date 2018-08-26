const vfs = require('vinyl-fs')
const chalk = require('chalk')
const path = require('path')

const { loadPresentationFiles } = require('../core/load_presentation_files')

function prepare ({ root }, { output, files }) {
  if (!path.isAbsolute(output)) {
    output = path.join(root, output)
  }

  const stream = loadPresentationFiles(files)
    .pipe(vfs.dest(output))

  return new Promise((resolve, reject) => {
    stream
      .on('end', resolve)
      .on('error', reject)
  })
}

prepare.config = {
  requiredExistingPresentation: true
}

prepare.messages = (_, { output }) => ({
  start: 'Project preparation in progress',
  end: chalk`Project prepared in {bold ${output}} dir`
})

module.exports = prepare
