var itsApp = true;

var _ = require('lodash');
var $ = require('jquery');

var $list = $('#list');

console.log(typeof $);

window.setTimeout(function () {
  $list.children().each(function (index, node) {
    var $node = $(node);
    $node.html($node.html() +' qweqweqweqwe!');
  });
}, 2000);

