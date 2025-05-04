// webpack.config.js
'use strict';

const path = require('path');
const nodeExternals = require('webpack-node-externals');

/** @type {import('webpack').Configuration} */
module.exports = {
  target: 'node',
  mode: 'production',

  // entry point to your extension's code
  entry: './src/extension.ts',

  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },

  // externalize everything in node_modules AND vscode
  externals: [
    // leave vscode built-in
    { vscode: 'commonjs vscode' },

    // leave all other node_modules on disk
    nodeExternals()
  ],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },

  // don't split into chunks
  optimization: {
    splitChunks: false,
    runtimeChunk: false
  },

  devtool: 'hidden-source-map'
};
