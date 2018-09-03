/**
 * Rule is to impose the presence of an end event in the process.
 */

module.exports = utils => {
  const { isNodeOfType } = utils;
  const ERROR = 'is missing an End Event';

  function hasEndEvent(node) {
    return (
      (node.flowElements || []).filter(node => isNodeOfType(node, 'EndEvent'))
        .length > 0
    );
  }

  function check(node, reporter) {
    if (isNodeOfType(node, 'Process')) {
      if (!hasEndEvent(node)) {
        reporter.report(node.id, ERROR);
      }
    }
  }

  return { check };
};