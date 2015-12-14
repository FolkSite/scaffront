var extend = require('extend');

var data = {
  title: 'Блаблабла'
};


data = extend(true, {}, require('./layouts/default-data'), data);

module.exports = data;
