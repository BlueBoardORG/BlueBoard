const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { DefinePlugin } = require("webpack");
const env = require("dotenv").config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  name: "server",
  target: "node",
  externals: [nodeExternals()],
  entry: "./src/server/server.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "server.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        loader: "ignore-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              emitFile: false,
              limit: 4096,
              name: "[name].[hash:6].[ext]",
              publicPath: "/static/images/"
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: {
          loader: "svg-url-loader",
          options: {
            noquotes: true,
            emitFile: false,
            limit: 4096,
            name: "[name].[hash:6].[ext]",
            outputPath: "images/"
          }
        }
      }
    ]
  },
  plugins: [
    new DefinePlugin(envKeys)
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
