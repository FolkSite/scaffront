var Handlebars = require("handlebars");module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\r\n      <title>Its layout's Head</title>\r\n    ";
  }

function program3(depth0,data) {
  
  
  return "\r\n        Its layout's Header\r\n      ";
  }

function program5(depth0,data) {
  
  
  return "\r\n        Its layout's Content\r\n      ";
  }

function program7(depth0,data) {
  
  
  return "\r\n        Its layout's Footer\r\n      ";
  }

  buffer += "<!doctype html>\r\n<html lang=\"ru\">\r\n  <head>\r\n    <meta charset=\"UTF-8\">\r\n\r\n    ";
  stack1 = (helper = helpers.block || (depth0 && depth0.block),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, "Head", options) : helperMissing.call(depth0, "block", "Head", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n  </head>\r\n  <body>\r\n\r\n    <header>\r\n      ";
  stack1 = (helper = helpers.block || (depth0 && depth0.block),options={hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data},helper ? helper.call(depth0, "Header", options) : helperMissing.call(depth0, "block", "Header", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </header>\r\n\r\n    <article role=\"main\">\r\n      ";
  stack1 = (helper = helpers.block || (depth0 && depth0.block),options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data},helper ? helper.call(depth0, "Content", options) : helperMissing.call(depth0, "block", "Content", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </article>\r\n\r\n    <footer>\r\n      ";
  stack1 = (helper = helpers.block || (depth0 && depth0.block),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, "Footer", options) : helperMissing.call(depth0, "block", "Footer", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n    </footer>\r\n\r\n  </body>\r\n</html>";
  return buffer;
  });