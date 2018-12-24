require('@babel/register');

module.exports = env => {
  if (env && env.devServer) {
    return require('./webpack.dev.config.js')
  } else {
    return require('./webpack.prod.config.js')
  }
}
