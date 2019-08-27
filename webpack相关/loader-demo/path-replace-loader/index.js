/**
 * 注意要将此包移动至node_modules下
 */

const fs = require('fs')
const loaderUtils = require('loader-utils')

module.exports = function(source) {
    this.cacheable && this.cacheable()
    const callback = this.async()
    const options = loaderUtils.getOptions(this)
    
    console.log("===============path-replace-loader work===================")

    if (this.resourcePath.indexOf(options.path) > -1) {
      console.log("===============path-replace-loader match===================")
        const newPath = this.resourcePath.replace(options.path, options.replacePath)

        fs.readFile(newPath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') return callback(null, source)
                return callback(err)
            }

            this.addDependency(newPath)
            callback(null, data)
        })
    }
    else {
        callback(null, source)
    }
}

module.exports.raw = true 