const path = require('path');
const { root, entries } = require('./entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}, argv) => {
  const
    removeGlobalJSNames = [],
    globalNames = root.filter(n => !(entries[n] instanceof Array)),
    globalJSNames = globalNames.filter(n => entries[n].match(/\.js$/g)),
    globalCSSNames = globalNames.filter(n => entries[n].match(/\.(css|s[ac]ss)$/g)),
    htmlWebpackPlugins = Object.entries(entries).filter(([, p]) => p instanceof Array).map(([n,]) => {
      const isMain = root.includes(n);

      return new HtmlWebpackPlugin({
        filename: isMain ? 'index.html' : `${n}/index.html`,
        // template: 'inventory/default.html',
        inject: false,
        templateContent: ({ htmlWebpackPlugin: { files } }) => {
          console.log('####################### files : ', n, files);
          return (
`<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="height=device-height,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <meta name="application-name" content="인프런" />
    <meta name="theme-color" content="#2EC276" />
    <link rel="shortcut icon" href="favicon.ico" />

    <title>${n}</title>

    ${globalCSSNames
      .map(name => files.css.find(css => css.match(new RegExp('css\\/' + name + '\..+\.css$', 'g'))) || '')
      .map(path => path ? `<link rel="stylesheet" href="${path}" />` : '').join('\n')}
    ${files.css
      .filter(css => css.match(new RegExp(n + '\\/.+\.css$', 'g')))
      .map(path => `<link rel="stylesheet" href="${path}" />`).join('\n')}
    ${globalJSNames
        .map(name => files.js.find(js => js.match(new RegExp('js\\/' + name + '\..+\.js$', 'g'))) || '')
        .map(path => path ? `<script type="text/javascript" src="${path}"></script>` : '').join('\n')}
  </head>
  <body>
    <header id="header"></header>
    <main id="main"></main>
    <footer id="footer"></footer>
    ${files.js
      .filter(js => js.match(new RegExp(n + '\\/.+\.js$', 'g')))
      .map(path => `<script type="text/javascript" src="${path}"></script>`).join('\n')}
  </body>
</html>`);
        }});
      });
  const miniCssExtractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      esModule: true,
    }
  };
  const cssLoader = {
    loader: 'css-loader',
    options: { sourceMap: true }
  };

  // chunkhash 값으로 인해 다음 로직이 동작하지 않음
  root
    .filter(r => {
      const p = entries[r];

      return typeof p === 'string' ? p.match(/\.(css|s[ac]ss)$/g)
        : p instanceof Array ? p.filter(_p => _p.match(/\.js$/g)).length === 0
        : false})
    .forEach(n => {
      removeGlobalJSNames.push(`js/${n}.js`);
      removeGlobalJSNames.push(`js/${n}.js.map`);
    });

  return {
    mode: env.prod ? 'production' : 'development',
    devtool: 'source-map',
    stats: env.prod ? 'errors-only' : 'normal',
    entry: entries,
    context: path.resolve(__dirname, ''), 
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: pathData => root.includes(pathData.chunk.name) ? 'js/[name].[chunkhash].js' : '[name]/index.[chunkhash].js',
      publicPath: '',
    },
    resolve: {
      alias: {
        Lib: path.resolve(__dirname, 'lib'),
        Js: path.resolve(__dirname, 'src/js'),
        Components: path.resolve(__dirname, 'src/components'),
      }
    },
    module: {
      rules: [
        { test: /\.css$/, use: [miniCssExtractPluginLoader, cssLoader] },
        {
          test: /\.s[ac]ss$/i,
          use: [miniCssExtractPluginLoader, cssLoader, 'sass-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        moduleFilename: ({ name }) => root.includes(name) ? 'css/[name].[chunkhash].css' : '[name]/style.[chunkhash].css',
      }),
      new CopyPlugin({
        patterns: [
          { from: 'assets' },
          // { 
          //   from: '**/*.html',
          //   toType: 'dir',
          //   context: path.resolve(__dirname, 'src/pages')
          // }
        ]
      }),
      new RemovePlugin({
        after: {
          root: './dist',
          include: removeGlobalJSNames,
          log: !env.prod,
          logWarning: !env.prod
        },
      }),
      ...htmlWebpackPlugins
    ]
  };
};