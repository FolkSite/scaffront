var Handlebars = require("handlebars");
module.exports = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
  this.compilerInfo = [4, '>= 1.0.0'];
  helpers           = this.merge(helpers, Handlebars.helpers);
  partials          = this.merge(partials, Handlebars.partials);
  data              = data || {};
  var buffer        = "", stack1, helper, options, functionType = "function", escapeExpression = this.escapeExpression, self = this, helperMissing = helpers.helperMissing;

  function program1 (depth0, data) {

    var buffer = "", stack1, helper, options;
    buffer += "\r\n  ";
    stack1     = (helper = helpers.content || (depth0 && depth0.content), options = {
      hash: {},
      inverse: self.noop,
      fn: self.program(2, program2, data),
      data: data
    }, helper ? helper.call(depth0, "Head", options) : helperMissing.call(depth0, "content", "Head", options));
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n\r\n  ";
    stack1 = (helper = helpers.content || (depth0 && depth0.content), options = {
      hash: {},
      inverse: self.noop,
      fn: self.program(4, program4, data),
      data: data
    }, helper ? helper.call(depth0, "Header", options) : helperMissing.call(depth0, "content", "Header", options));
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n\r\n  ";
    stack1 = (helper = helpers.content || (depth0 && depth0.content), options = {
      hash: {},
      inverse: self.noop,
      fn: self.program(6, program6, data),
      data: data
    }, helper ? helper.call(depth0, "Content", options) : helperMissing.call(depth0, "content", "Content", options));
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n\r\n  ";
    stack1 = (helper = helpers.content || (depth0 && depth0.content), options = {
      hash: {},
      inverse: self.noop,
      fn: self.program(9, program9, data),
      data: data
    }, helper ? helper.call(depth0, "Footer", options) : helperMissing.call(depth0, "content", "Footer", options));
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n";
    return buffer;
  }

  function program2 (depth0, data) {


    return "It's index Head";
  }

  function program4 (depth0, data) {


    return "It's index Header";
  }

  function program6 (depth0, data) {

    var buffer = "", stack1, helper;
    buffer += "\r\n    It's index Content append\r\n    config.param2: "
      + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.config)), stack1 == null || stack1 === false ? stack1 : stack1.param2)), typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "\r\n\r\n    <div class=\"post\">\r\n      <h1>By "
      + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.author)), stack1 == null || stack1 === false ? stack1 : stack1.firstName)), typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + " "
      + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.author)), stack1 == null || stack1 === false ? stack1 : stack1.lastName)), typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "</h1>\r\n      <div class=\"body\">";
    if (helper = helpers.body) {
      stack1 = helper.call(depth0, {hash: {}, data: data});
    }
    else {
      helper = (depth0 && depth0.body);
      stack1 = typeof helper === functionType ? helper.call(depth0, {hash: {}, data: data}) : helper;
    }
    buffer += escapeExpression(stack1)
      + "</div>\r\n\r\n      <h1>Comments</h1>\r\n\r\n      ";
    stack1 = helpers.each.call(depth0, (depth0 && depth0.comments), {
      hash: {},
      inverse: self.noop,
      fn: self.program(7, program7, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n\r\n      ";
    stack1 = self.invokePartial(partials['chunks/part'], 'chunks/part', depth0, helpers, partials, data);
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += "\r\n    </div>\r\n  ";
    return buffer;
  }

  function program7 (depth0, data) {

    var buffer = "", stack1, helper;
    buffer += "\r\n        <h2>By "
      + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.author)), stack1 == null || stack1 === false ? stack1 : stack1.firstName)), typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + " "
      + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.author)), stack1 == null || stack1 === false ? stack1 : stack1.lastName)), typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
      + "</h2>\r\n        <div class=\"body\">";
    if (helper = helpers.body) {
      stack1 = helper.call(depth0, {hash: {}, data: data});
    }
    else {
      helper = (depth0 && depth0.body);
      stack1 = typeof helper === functionType ? helper.call(depth0, {hash: {}, data: data}) : helper;
    }
    buffer += escapeExpression(stack1)
      + "</div>\r\n      ";
    return buffer;
  }

  function program9 (depth0, data) {


    return "It's index Footer";
  }

  stack1 = (helper = helpers.extend || (depth0 && depth0.extend), options = {
    hash: {},
    inverse: self.noop,
    fn: self.program(1, program1, data),
    data: data
  }, helper ? helper.call(depth0, "layout", options) : helperMissing.call(depth0, "extend", "layout", options));
  if (stack1 || stack1 === 0) {
    buffer += stack1;
  }
  buffer += "\r\n\r\n";
  return buffer;
});