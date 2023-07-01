const esbuild = require('esbuild');
const { default: graphqlLoaderPlugin } = require('@luckycatfactory/esbuild-graphql-loader');
const nativeNodePlugin = require("../plugin/native.node.plugin");

esbuild.build({
  logLevel: 'info',
  plugins: [graphqlLoaderPlugin(), nativeNodePlugin()],
  entryPoints: ['script/script-generate-schema.js'],
  bundle: true,
  loader: { '.js': 'jsx' },
  platform: 'node',
  target: ['node14'],
  minify: true,
  sourcemap: false,
  outdir: 'build',
});
