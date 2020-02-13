// https://webpack.js.org/configuration/devtool/
// https://www.npmjs.com/package/typedoc-webpack-plugin
// const LiveReloadPlugin = require("webpack-livereload-plugin");
// const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
module.exports = {
  mode: "development",
  // devtool: "eval-source-map",
  optimization: {
    minimize: true
  },
  entry: "./src/app.js",
  output: {
    filename: "app.bundle.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
  ],
  watchOptions: {
    poll: true
  }
  // plugins: [
  //   new LiveReloadPlugin({
  //     appendScriptTag: true
  //   })
  //   // new TypedocWebpackPlugin({
  //   //     mode: 'module',
  //   //     includeDeclarations: true,
  //   //     ignoreCompilerErrors: true,
  //   //     experimentalDecorators: true,
  //   //     excludeExternals: true,
  //   //     excludePrivate: false,
  //   //     out: './docs',

  //   //     module: 'commonjs',
  //   //     target: 'es5',
  //   //     name: 'Physics',
  //   //     readme: 'README.md'
  //   // })
  // ]
};
