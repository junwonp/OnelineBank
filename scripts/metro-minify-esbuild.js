const { transformSync } = require('esbuild');

module.exports = function minify({ code, config }) {
  const result = transformSync(code, {
    minify: true,
    legalComments: 'none',
    sourcemap: 'external',
    ...config,
  });

  return {
    code: result.code,
    map: result.map
      ? JSON.parse(result.map)
      : { version: 3, mappings: '', names: [], sources: [] },
  };
};
