var extend = require('extend');

var data = {
  title: 'Регистрация исполнителля'
};

data = extend(true, {}, require('../_layouts/auth-data.js'), data);
module.exports = data;
