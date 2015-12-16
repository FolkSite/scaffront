var extend = require('extend');

var data = {
  title: 'Регистрация исполнителля'
};

data = extend(true, {}, require('../tpls/auth-data.js'), data);
module.exports = data;
