const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/app.js",
  mode: process.NODE_ENV,
  target: "node",
  output: {
    filename: "main.js",
    path: `${__dirname}/dist`
  },
  externals: [nodeExternals()]
};
