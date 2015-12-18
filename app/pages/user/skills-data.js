var extend = require('extend');

var data = {
  title: 'Мои навыки'
};

data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
