const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.join(__dirname, '/client');
const DIST_DIR = path.join(__dirname, '/public');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: [/\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  },
  devtool: false,
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
  externals: {
    "styled-components": "styled"
    "axios": "axios",
    "moment": "moment",
    "react": "React",
    "react-dom": "ReactDOM"
  },
};
