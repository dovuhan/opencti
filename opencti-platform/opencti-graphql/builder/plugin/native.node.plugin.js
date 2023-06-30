const path = require('node:path');

const nativeNodeModulesPlugin = () => ({
  name: 'native-node-modules',
  setup(build) {
    // Resolve ".node" files and put them in the "node-file" virtual namespace
    build.onResolve({ filter: /\.node$/, namespace: 'file' }, (args) => {
      const resolvedId = require.resolve(args.path, {
        paths: [args.resolveDir],
      });
      return {
        path: resolvedId,
        namespace: 'node-file',
      };
    });

    // Load ".node" files from the "node-file" virtual namespace
    build.onLoad({ filter: /.*/, namespace: 'node-file' }, (args) => {
      return {
        contents: `
          import path from ${JSON.stringify(args.path)};
          try { module.exports = require(path); }
          catch {}
        `,
        resolveDir: path.dirname(args.path),
      };
    });

    // Put ".node" files back into the "file" namespace
    build.onResolve(
      { filter: /\.node$/, namespace: 'node-file' },
      (args) => ({
        path: args.path,
        namespace: 'file',
      })
    );

    // Use the "file" loader for ".node" files
    const opts = build.initialOptions;
    opts.loader = opts.loader || {};
    opts.loader['.node'] = 'file';
  },
});

module.exports = nativeNodeModulesPlugin;
