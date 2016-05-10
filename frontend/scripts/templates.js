var extend = require('extend');
var path = require('path');
swig = require('swig');

global.App = global.App || {};
App.views = App.views || {};

App.views.Index = {
  tpl: require('../../app/templates/index.js'),
  sample: require('../../app/templates/index-data.js')
};

console.log(swig.run(App.views.Index.tpl, App.views.Index.sample));

$('.post').html(
  swig.run(App.views.Index.tpl, App.views.Index.sample)
);

return;

console.log();