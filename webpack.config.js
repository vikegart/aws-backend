const slsw = require("serverless-webpack");
const path = require("path");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ["", '.ts', '.tsx', '.js', '.json'],
    alias: {
      'pg-native': path.join(__dirname, 'aliases/pg-native.js'),
      'pgpass$': path.join(__dirname, 'aliases/pgpass.js'),
    },
  },
};
