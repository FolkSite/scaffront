var extend = require('extend');

var data = {
  title: 'Мои локации',
  userLocations: [{
    id: 100500,
    title: 'Санкт-Петербург',
  }, {
    id: 1313,
    title: 'Челябинск',
  }]
};

data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
