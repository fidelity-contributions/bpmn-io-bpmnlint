const Module = require('module');
const path = require('path');

/**
 * Create require function for a given path.
 *
 * @param {string} cwd
 * @returns {NodeRequire}
 */
module.exports.createScopedRequire = function(cwd) {

  // shim createRequireFromPath for Node < 10.12
  // shim createRequireFromPath for Node < 12.2.0
  const createRequireFromPath = Module.createRequire || Module.createRequireFromPath || (filename => {
    const mod = new Module(filename, null);

    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename));
    mod._compile('module.exports = require;', filename);

    return mod.exports;
  });

  return createRequireFromPath(path.join(cwd, '__placeholder__.js'));
};
