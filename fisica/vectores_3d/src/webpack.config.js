const path = require('path');
const core_3d = path.resolve(__dirname, '../../../js/core_3d/');

module.exports = {
  mode: 'development',
  entry: './main.ts',
  optimization: {
    minimize: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'lib': path.resolve(core_3d, 'src'),
      'three': path.resolve(core_3d, 'node_modules', 'three')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: true
  }
}