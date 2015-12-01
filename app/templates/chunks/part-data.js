var Extend = require('extend');

module.exports = function () {
  return Extend(true, {
    items: [
      {name: "Handlebars", emotion: "love"},
      {name: "Mustache", emotion: "enjoy"},
      {name: "SproutCore", emotion: "want to learn"}
    ]
  });
}();
