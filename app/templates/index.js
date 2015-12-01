module.exports = function (_swig,_ctx,_filters,_utils,_fn
/**/) {
  var _ext = _swig.extensions,
    _output = "";
_output += "<!doctype html>\n<html lang=\"ru\">\n  <head>\n    <meta charset=\"UTF-8\">\n\n    ";
_output += "\n <title>It's index Head</title>\n  ";
_output += "\n      <title>Its layout's Head</title>\n    ";

_output += "\n";
_output += "\n\n  </head>\n  <body>\n\n    <header>\n      ";
_output += "\n  ";
_output += "\n        Its layout's Header\n      ";

_output += "\n  It's index Header\n";
_output += "\n    </header>\n\n    <article role=\"main\">\n      ";
_output += "\n    It's index Content append\n    config.param2: ";
_output += _filters["e"]((((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param2 !== undefined && _ctx.config.param2 !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param2 !== undefined && _ctx.config.param2 !== null) ? _ctx.config.param2 : "") : ((typeof config !== "undefined" && config !== null && config.param2 !== undefined && config.param2 !== null) ? config.param2 : "")) !== null ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param2 !== undefined && _ctx.config.param2 !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param2 !== undefined && _ctx.config.param2 !== null) ? _ctx.config.param2 : "") : ((typeof config !== "undefined" && config !== null && config.param2 !== undefined && config.param2 !== null) ? config.param2 : "")) : "" ));
_output += "\n\n    <div class=\"post\">\n      <h1>By ";
_output += _filters["e"]((((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.firstName !== undefined && _ctx.author.firstName !== null) ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.firstName !== undefined && _ctx.author.firstName !== null) ? _ctx.author.firstName : "") : ((typeof author !== "undefined" && author !== null && author.firstName !== undefined && author.firstName !== null) ? author.firstName : "")) !== null ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.firstName !== undefined && _ctx.author.firstName !== null) ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.firstName !== undefined && _ctx.author.firstName !== null) ? _ctx.author.firstName : "") : ((typeof author !== "undefined" && author !== null && author.firstName !== undefined && author.firstName !== null) ? author.firstName : "")) : "" ));
_output += " ";
_output += _filters["e"]((((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.lastName !== undefined && _ctx.author.lastName !== null) ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.lastName !== undefined && _ctx.author.lastName !== null) ? _ctx.author.lastName : "") : ((typeof author !== "undefined" && author !== null && author.lastName !== undefined && author.lastName !== null) ? author.lastName : "")) !== null ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.lastName !== undefined && _ctx.author.lastName !== null) ? ((typeof _ctx.author !== "undefined" && _ctx.author !== null && _ctx.author.lastName !== undefined && _ctx.author.lastName !== null) ? _ctx.author.lastName : "") : ((typeof author !== "undefined" && author !== null && author.lastName !== undefined && author.lastName !== null) ? author.lastName : "")) : "" ));
_output += "</h1>\n      <div class=\"body\">";
_output += _filters["e"]((((typeof _ctx.body !== "undefined" && _ctx.body !== null) ? ((typeof _ctx.body !== "undefined" && _ctx.body !== null) ? _ctx.body : "") : ((typeof body !== "undefined" && body !== null) ? body : "")) !== null ? ((typeof _ctx.body !== "undefined" && _ctx.body !== null) ? ((typeof _ctx.body !== "undefined" && _ctx.body !== null) ? _ctx.body : "") : ((typeof body !== "undefined" && body !== null) ? body : "")) : "" ));
_output += "</div>\n\n      <h1>Comments</h1>\n\n      ";
(function () {
  var __l = (((typeof _ctx.comments !== "undefined" && _ctx.comments !== null) ? ((typeof _ctx.comments !== "undefined" && _ctx.comments !== null) ? _ctx.comments : "") : ((typeof comments !== "undefined" && comments !== null) ? comments : "")) !== null ? ((typeof _ctx.comments !== "undefined" && _ctx.comments !== null) ? ((typeof _ctx.comments !== "undefined" && _ctx.comments !== null) ? _ctx.comments : "") : ((typeof comments !== "undefined" && comments !== null) ? comments : "")) : "" ), __len = (_utils.isArray(__l) || typeof __l === "string") ? __l.length : _utils.keys(__l).length;
  if (!__l) { return; }
    var _ctx__loopcache05491265812888741 = { loop: _ctx.loop, comment: _ctx.comment, __k: _ctx.__k };
    _ctx.loop = { first: false, index: 1, index0: 0, revindex: __len, revindex0: __len - 1, length: __len, last: false };
  _utils.each(__l, function (comment, __k) {
    _ctx.comment = comment;
    _ctx.__k = __k;
    _ctx.loop.key = __k;
    _ctx.loop.first = (_ctx.loop.index0 === 0);
    _ctx.loop.last = (_ctx.loop.revindex0 === 0);
    _output += "\n        <h2>By ";
_output += _filters["e"]((((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.firstName !== undefined && _ctx.comment.author.firstName !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.firstName !== undefined && _ctx.comment.author.firstName !== null) ? _ctx.comment.author.firstName : "") : ((typeof comment !== "undefined" && comment !== null && comment.author !== undefined && comment.author !== null && comment.author.firstName !== undefined && comment.author.firstName !== null) ? comment.author.firstName : "")) !== null ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.firstName !== undefined && _ctx.comment.author.firstName !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.firstName !== undefined && _ctx.comment.author.firstName !== null) ? _ctx.comment.author.firstName : "") : ((typeof comment !== "undefined" && comment !== null && comment.author !== undefined && comment.author !== null && comment.author.firstName !== undefined && comment.author.firstName !== null) ? comment.author.firstName : "")) : "" ));
_output += " ";
_output += _filters["e"]((((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.lastName !== undefined && _ctx.comment.author.lastName !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.lastName !== undefined && _ctx.comment.author.lastName !== null) ? _ctx.comment.author.lastName : "") : ((typeof comment !== "undefined" && comment !== null && comment.author !== undefined && comment.author !== null && comment.author.lastName !== undefined && comment.author.lastName !== null) ? comment.author.lastName : "")) !== null ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.lastName !== undefined && _ctx.comment.author.lastName !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.author !== undefined && _ctx.comment.author !== null && _ctx.comment.author.lastName !== undefined && _ctx.comment.author.lastName !== null) ? _ctx.comment.author.lastName : "") : ((typeof comment !== "undefined" && comment !== null && comment.author !== undefined && comment.author !== null && comment.author.lastName !== undefined && comment.author.lastName !== null) ? comment.author.lastName : "")) : "" ));
_output += "</h2>\n        <div class=\"body\">";
_output += _filters["e"]((((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.body !== undefined && _ctx.comment.body !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.body !== undefined && _ctx.comment.body !== null) ? _ctx.comment.body : "") : ((typeof comment !== "undefined" && comment !== null && comment.body !== undefined && comment.body !== null) ? comment.body : "")) !== null ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.body !== undefined && _ctx.comment.body !== null) ? ((typeof _ctx.comment !== "undefined" && _ctx.comment !== null && _ctx.comment.body !== undefined && _ctx.comment.body !== null) ? _ctx.comment.body : "") : ((typeof comment !== "undefined" && comment !== null && comment.body !== undefined && comment.body !== null) ? comment.body : "")) : "" ));
_output += "</div>\n      ";
    _ctx.loop.index += 1; _ctx.loop.index0 += 1; _ctx.loop.revindex -= 1; _ctx.loop.revindex0 -= 1;
  });
  _ctx.loop = _ctx__loopcache05491265812888741.loop;
  _ctx.comment = _ctx__loopcache05491265812888741.comment;
  _ctx.__k = _ctx__loopcache05491265812888741.__k;
  _ctx__loopcache05491265812888741 = undefined;
})();
_output += "\n\n      ";
_output += _swig.compileFile('./chunks/part.html', {resolveFrom: "./app/templates/index.html"})(_ctx);
_output += "\n    </div>\n";
_output += "\n    </article>\n\n    <footer>\n      ";
_output += "\n  It's index Footer\n";
_output += "\n    </footer>\n\n    <script src=\"/js/vendor/jquery-1.11.2.min.js\"></script>\n    <script src=\"/js/libs.js\"></script>\n    <script src=\"/js/templates.js\"></script>\n    <script src=\"/js/js.js\"></script>\n\n  </body>\n</html>";

  return _output;

};
