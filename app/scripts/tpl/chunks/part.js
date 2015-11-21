var Handlebars = require("handlebars");module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\r\n    <li>I agree. I ";
  if (helper = helpers.emotion) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.emotion); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " "
    + escapeExpression((helper = helpers.upcase || (depth0 && depth0.upcase),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.name), options) : helperMissing.call(depth0, "upcase", (depth0 && depth0.name), options)))
    + "</li>\r\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\r\n  is Production!!!!!!!!\r\n";
  }

function program5(depth0,data) {
  
  
  return "\r\n  is Development!!!!!!!!\r\n";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  ";
  if (helper = helpers.bar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n";
  if (helper = helpers.foo) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.foo); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\r\n";
  return buffer;
  }

  buffer += "config.param1: "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.config)),stack1 == null || stack1 === false ? stack1 : stack1.param1)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\r\n<ul>\r\n  ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.items), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</ul>\r\n\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isProduction), {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n\r\n\r\n\r\n";
  options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data}
  if (helper = helpers.raw) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.raw); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.raw) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  options={hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data}
  if (helper = helpers.raw) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.raw); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.raw) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n"
    + escapeExpression((helper = helpers['default'] || (depth0 && depth0['default']),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.qweqweqwe), "No qweqweqwe available.", options) : helperMissing.call(depth0, "default", (depth0 && depth0.qweqweqwe), "No qweqweqwe available.", options)));
  return buffer;
  });