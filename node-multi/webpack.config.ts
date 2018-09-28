import * as path from 'path'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'
import * as nodeExternals from 'webpack-node-externals'

const config: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: nodeExternals(),
}

export default config
