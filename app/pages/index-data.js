var Extend = require('extend');

module.exports = function () {
  return Extend(true, {
    author: {
      firstName: "Alan",
      lastName: "Johnson"
    },
    body: "I Love Handlebars",
    comments: [{
      author: {
        firstName: "Yehuda",
        lastName: "Katz"
      },
      body: "Me too!"
    }]
  }, {});
}