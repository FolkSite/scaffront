module.exports = function anonymous(_swig,_ctx,_filters,_utils,_fn
/**/) {
  var _ext = _swig.extensions,
    _output = "";
_output += "config.param1: ";
_output += _filters["e"]((((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param1 !== undefined && _ctx.config.param1 !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param1 !== undefined && _ctx.config.param1 !== null) ? _ctx.config.param1 : "") : ((typeof config !== "undefined" && config !== null && config.param1 !== undefined && config.param1 !== null) ? config.param1 : "")) !== null ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param1 !== undefined && _ctx.config.param1 !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.param1 !== undefined && _ctx.config.param1 !== null) ? _ctx.config.param1 : "") : ((typeof config !== "undefined" && config !== null && config.param1 !== undefined && config.param1 !== null) ? config.param1 : "")) : "" ));
_output += "\n\n<ul id=\"list\">\n  ";
(function () {
  var __l = (((typeof _ctx.items !== "undefined" && _ctx.items !== null) ? ((typeof _ctx.items !== "undefined" && _ctx.items !== null) ? _ctx.items : "") : ((typeof items !== "undefined" && items !== null) ? items : "")) !== null ? ((typeof _ctx.items !== "undefined" && _ctx.items !== null) ? ((typeof _ctx.items !== "undefined" && _ctx.items !== null) ? _ctx.items : "") : ((typeof items !== "undefined" && items !== null) ? items : "")) : "" ), __len = (_utils.isArray(__l) || typeof __l === "string") ? __l.length : _utils.keys(__l).length;
  if (!__l) { return; }
    var _ctx__loopcache08270060704089701 = { loop: _ctx.loop, item: _ctx.item, __k: _ctx.__k };
    _ctx.loop = { first: false, index: 1, index0: 0, revindex: __len, revindex0: __len - 1, length: __len, last: false };
  _utils.each(__l, function (item, __k) {
    _ctx.item = item;
    _ctx.__k = __k;
    _ctx.loop.key = __k;
    _ctx.loop.first = (_ctx.loop.index0 === 0);
    _ctx.loop.last = (_ctx.loop.revindex0 === 0);
    _output += "\n    <li>I agree. I ";
_output += _filters["e"]((((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.emotion !== undefined && _ctx.item.emotion !== null) ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.emotion !== undefined && _ctx.item.emotion !== null) ? _ctx.item.emotion : "") : ((typeof item !== "undefined" && item !== null && item.emotion !== undefined && item.emotion !== null) ? item.emotion : "")) !== null ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.emotion !== undefined && _ctx.item.emotion !== null) ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.emotion !== undefined && _ctx.item.emotion !== null) ? _ctx.item.emotion : "") : ((typeof item !== "undefined" && item !== null && item.emotion !== undefined && item.emotion !== null) ? item.emotion : "")) : "" ));
_output += " ";
_output += _filters["e"](_filters["upper"]((((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.name !== undefined && _ctx.item.name !== null) ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.name !== undefined && _ctx.item.name !== null) ? _ctx.item.name : "") : ((typeof item !== "undefined" && item !== null && item.name !== undefined && item.name !== null) ? item.name : "")) !== null ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.name !== undefined && _ctx.item.name !== null) ? ((typeof _ctx.item !== "undefined" && _ctx.item !== null && _ctx.item.name !== undefined && _ctx.item.name !== null) ? _ctx.item.name : "") : ((typeof item !== "undefined" && item !== null && item.name !== undefined && item.name !== null) ? item.name : "")) : "" )));
_output += "</li>\n  ";
    _ctx.loop.index += 1; _ctx.loop.index0 += 1; _ctx.loop.revindex -= 1; _ctx.loop.revindex0 -= 1;
  });
  _ctx.loop = _ctx__loopcache08270060704089701.loop;
  _ctx.item = _ctx__loopcache08270060704089701.item;
  _ctx.__k = _ctx__loopcache08270060704089701.__k;
  _ctx__loopcache08270060704089701 = undefined;
})();
_output += "\n</ul>\n\n";
if ((((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.isProduction !== undefined && _ctx.config.isProduction !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.isProduction !== undefined && _ctx.config.isProduction !== null) ? _ctx.config.isProduction : "") : ((typeof config !== "undefined" && config !== null && config.isProduction !== undefined && config.isProduction !== null) ? config.isProduction : "")) !== null ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.isProduction !== undefined && _ctx.config.isProduction !== null) ? ((typeof _ctx.config !== "undefined" && _ctx.config !== null && _ctx.config.isProduction !== undefined && _ctx.config.isProduction !== null) ? _ctx.config.isProduction : "") : ((typeof config !== "undefined" && config !== null && config.isProduction !== undefined && config.isProduction !== null) ? config.isProduction : "")) : "" )) { 
_output += "\n  is Production!!\n";
} else {
_output += "\n  is Development!!\n";

}_output += "\n\n";
_output += "\n  ";
_output += "{{bar}}";
_output += "\n";
_output += "\n\n";

  return _output;

};