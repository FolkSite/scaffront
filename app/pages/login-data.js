var extend = require('extend');

var config = {
  title: 'Вход на сайт'
};


config = extend(true, {}, require('./tpls/auth-data'), config);
module.exports = config;
