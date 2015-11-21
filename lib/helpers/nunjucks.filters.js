var _ = require('lodash');
var filters = {};

/**
 * Proxy lodash for nunjucks templates.
 * Examples:
 * {{ variable | _isBoolean }}
 * {{ plainObject | _merge(anotherPlainObject) }}
 */
_.each(_.keys(_), function (method) {
  filters['_'+ method] = (function (method) {
    return function () {
      return _[method].apply(null, arguments);
    };
  })(method);
});

//filters.shorten = function(str, count) {
//  return str.slice(0, count || 5);
//};


module.exports = filters;



