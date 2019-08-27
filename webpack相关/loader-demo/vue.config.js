const path = require('path')

module.exports = {
  configureWebpack: {
    module: {
      rules: [{
        test: /\.js$/,
        // loader: require('./path-replace-loader'),
        loader: 'path-replace-loader',
        exclude: /(node_modules)/,
        include: /src/,
        options: {
          path: 'O_PATH',
          replacePath: path.resolve(__dirname, 'src')
        }
      }]
    }
  }
}
