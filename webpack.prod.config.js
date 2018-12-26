import path from 'path'
import webpack from 'webpack'
import SiteGenerator from 'static-site-generator-webpack-plugin';
import ExtractTextPlugin from "extract-text-webpack-plugin";

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
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    }, {
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
    new ExtractTextPlugin("styles.css"), 
    new SiteGenerator({
      crawl: true,
      paths: ['/'],
      target: "node",
      globals: {
        window: 'this',
        rootUrl: process.env.baseUrl || ''
      }
    })
  ]
}];
