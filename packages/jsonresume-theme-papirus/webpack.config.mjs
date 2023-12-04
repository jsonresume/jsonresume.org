import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  experiments: {
    outputModule: true,
  },
  devtool: 'source-map',
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          precompileOptions: {
            knownHelpersOnly: false,
          },
        },
      },
    ],
  },
};
