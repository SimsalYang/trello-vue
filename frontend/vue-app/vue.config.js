module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': '/api/v1'
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}