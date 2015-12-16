var extend = require('extend');

var data = {
  title: 'Вход на сайт'
};

data = extend(true, {}, require('../tpls/auth-data.js'), data);
module.exports = data;
