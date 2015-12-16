var extend = require('extend');

var data = {
  title: 'Мои локации',
};


data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
