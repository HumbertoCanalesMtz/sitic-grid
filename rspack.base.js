const path = require('path');

/**
 * Base Rspack configuration for UMD builds
 * @param {string} packageName - The package name (e.g., 'core', 'button', 'card')
 * @param {string} globalName - The global variable name (e.g., 'SitiComponentsCore', 'SitiButton', 'SitiCard')
 * @param {string} entry - Entry point file path
 */
function createBaseConfig(packageName, globalName, entry) {
  return {
    entry: entry,
    mode: 'production',
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      filename: `${packageName}.js`,
      library: {
        name: globalName,
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: true
    },
    externals: {
      'react': {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM'
      },
      'react/jsx-runtime': {
        commonjs: 'react/jsx-runtime',
        commonjs2: 'react/jsx-runtime',
        amd: 'react/jsx-runtime',
        root: ['React', 'jsx']
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true
                },
                transform: {
                  react: {
                    runtime: 'classic',
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment'
                  }
                },
                target: 'es2020'
              },
              module: {
                type: 'es6'
              }
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    optimization: {
      minimize: true
    },
    devtool: 'source-map'
  };
}

module.exports = { createBaseConfig };