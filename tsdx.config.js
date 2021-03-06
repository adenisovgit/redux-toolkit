const { join } = require('path')

const replace = require('rollup-plugin-replace')
const stripCode = require('rollup-plugin-strip-code')

const pkg = require('./package.json')

module.exports = {
  rollup(config, options) {
    config.output.name = 'RTK'

    const { env, format } = options
    // eslint-disable-next-line default-case
    switch (format) {
      case 'umd':
        delete config.external
        config.output.indent = false
        config.plugins.unshift(
          replace({
            '// UMD-ONLY: ': '',
            delimiters: ['', '']
          })
        )
        config.plugins.unshift(
          stripCode({
            // Remove the `import` of RISI so we use the dynamic `require()` statement
            start_comment: 'START_REMOVE_UMD',
            end_comment: 'STOP_REMOVE_UMD'
          })
        )
        if (env === 'production') {
          config.plugins.unshift(
            stripCode({
              start_comment: 'PROD_START_REMOVE_UMD',
              end_comment: 'PROD_STOP_REMOVE_UMD'
            })
          )
          config.output.file = join(__dirname, pkg.unpkg)
        } else {
          config.output.file = config.output.file.replace(
            'umd.development',
            'umd'
          )
        }
        break
    }
    return config
  }
}
