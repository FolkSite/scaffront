require('domready')(function (e) {
  'use strict';

  document.querySelector('#component1').onclick = function (e) {
    console.log('loading component1 start');
    require.ensure([], function (require) {
      setTimeout(function () {
        var component = require('./components/component1');
        console.log('component1', component);
        console.log('loading component1 stop');
      }, 100);
    }, 'components-bundle');
  };

  document.querySelector('#component2').onclick = function (e) {
    console.log('loading component2 start');
    require.ensure([], function (require) {
      setTimeout(function () {
        var component = require('./components/component2');
        console.log('component2', component);
        console.log('loading component2 stop');
      }, 100);
    }, 'components-bundle');
  };
});
