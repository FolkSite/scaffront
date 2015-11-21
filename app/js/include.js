var _ = require('lodash');

module.exports = function () {
  var args = _.toArray(arguments);
  args.unshift('[include.js]');

  console.log.apply(console, args);

};
