var itsApp = true;

//var $ = require('jquery');

var $list = $('#list');

console.log('typeof $', typeof $);
console.log('typeof jQuery', typeof jQuery);
console.log('typeof _', typeof _);

window.setTimeout(function () {
  $list.children().each(function (index, node) {
    node.innerHTML += ' qweqweqweqwe!';
  });

  console.log('patch!');
}, 2000);


window.App = {};

App.test = 'test!';