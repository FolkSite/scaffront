var extend = require('extend');

var data = {
  title: 'Вход на сайт'
};

data = extend(true, {}, require('../_layouts/auth-data.js'), data);
module.exports = data;
