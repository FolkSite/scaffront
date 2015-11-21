function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (config, title, user) {
jade_mixins["childtpl"] = jade_interp = function(user){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div id=\"user\">");
if ( user.username)
{
buf.push("<h2>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</h2><h2>Description</h2><p class=\"description\">" + (jade.escape(null == (jade_interp = user.description) ? "" : jade_interp)) + "</p>");
}
else if ( !user.username)
{
buf.push("<h1>Description</h1><p class=\"description\">User has no description</p>");
}
buf.push("</div><div class=\"setting\">" + (jade.escape(null == (jade_interp = config.param2) ? "" : jade_interp)) + "</div>");
};
buf.push("<!DOCTYPE html><html><head><title>" + (jade.escape(null == (jade_interp = title) ? "" : jade_interp)) + "</title><!-- head default--><!-- head index--></head><body># Markdown\nI often like including markdown documents.<h1>My Article</h1>");
if ( config)
{
buf.push("<h2>" + (jade.escape(null == (jade_interp = config.param1) ? "" : jade_interp)) + "</h2>");
}
jade_mixins["childtpl"] = jade_interp = function(user){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div id=\"user\">");
if ( user.username)
{
buf.push("<h2>" + (jade.escape(null == (jade_interp = user.username) ? "" : jade_interp)) + "</h2><h2>Description</h2><p class=\"description\">" + (jade.escape(null == (jade_interp = user.description) ? "" : jade_interp)) + "</p>");
}
else if ( !user.username)
{
buf.push("<h1>Description</h1><p class=\"description\">User has no description</p>");
}
buf.push("</div><div class=\"setting\">" + (jade.escape(null == (jade_interp = config.param2) ? "" : jade_interp)) + "</div>");
};
if ( user)
{
jade_mixins["childtpl"](user);
}
buf.push("<ul><li>qweqwe <em><b>asdasd asd</b></em></li></ul></body></html>");}.call(this,"config" in locals_for_with?locals_for_with.config:typeof config!=="undefined"?config:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
}