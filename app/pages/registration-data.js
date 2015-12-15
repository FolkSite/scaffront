var extend = require('extend');

var config = {
  title: 'Регистрация исполнителля'
};


config = extend(true, {}, require('./tpls/auth-data'), config);
module.exports = config;
