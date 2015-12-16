var extend = require('extend');

var data = {
  title: 'Добавьте свой город',
};


data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
