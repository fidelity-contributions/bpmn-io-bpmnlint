const { createScopedRequire } = require('./helper');

/**
 * A resolver that locates rules and configurations
 * using node module resolution.
 */
function NodeResolver(options) {
  this.require = options && options.require || createScopedRequire(process.cwd());

  this.requireLocal = options && options.requireLocal || require;

  try {
    this.pkg = this.require('./package.json').name;
  } catch (err) {
    this.pkg = '__unknown';
  }
}

module.exports = NodeResolver;


NodeResolver.prototype.resolveRule = function(pkg, ruleName) {

  const originalPkg = pkg;

  pkg = this.normalizePkg(pkg);

  try {
    if (pkg === 'bpmnlint') {
      return this.requireLocal(`../../rules/${ruleName}`);
    } else {
      return this.require(`${pkg}/rules/${ruleName}`);
    }
  } catch (err) {
    throw new Error('Cannot resolve rule <' + ruleName + '> from <' + originalPkg + '>');
  }
};

NodeResolver.prototype.resolveConfig = function(pkg, configName) {

  const originalPkg = pkg;

  pkg = this.normalizePkg(pkg);

  // resolve config via $PKG/config/$NAME
  try {
    if (pkg === 'bpmnlint') {
      return this.requireLocal(`../../config/${configName}`);
    } else {
      return this.require(`${pkg}/config/${configName}`);
    }
  } catch (err) { /* ignore */ }

  // resolve config via $PKG.configs[$NAME]
  try {
    const instance = this.require(pkg);

    const configs = instance.configs || {};

    if (configName in configs) {
      return configs[configName];
    }
  } catch (err) {

    /* ignore */
  }

  throw new Error(
    'Cannot resolve config <' + configName + '> from <' + originalPkg + '>'
  );
};

NodeResolver.prototype.normalizePkg = function(pkg) {
  if (pkg !== 'bpmnlint' && pkg === this.pkg) {
    pkg = '.';
  }

  return pkg;
};
