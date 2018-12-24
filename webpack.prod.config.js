import path from 'path'
import SiteGenerator from 'static-site-generator-webpack-plugin';

export default [{
  entry: {
    generator: './generator.js',
    main: './client.js'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.(txt|md)/,
      use: "raw-loader"
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      },
    }]
  },
  plugins: [
    new SiteGenerator({
      crawl: true,
      paths: ['/'],
      target: "node",
      globals: {
        window: 'this'
      }
    })
  ]
}];
