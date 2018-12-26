import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default [{
  entry: {
    main: './client.js'
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'umd'
  },

  devServer: {
    inline: true,
    port: 3000,
    hot: true,
    historyApiFallback: true
  },

  module: {
    rules: [
      {test: /\.css/, use: [
        "style-loader","css-loader"
      ]}, 
      {test: /\.(txt|md)/, use: "raw-loader"}, 
      {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      },
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'templates/hot.html',
    })
  ]
}];
