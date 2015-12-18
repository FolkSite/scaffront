var extend = require('extend');

var data = {
  title: 'Мои локации',
  passport: {
    number1: 4005,
    nubmer2: 256551,
    department: '65 о/м Кировского р-на СПб',
    date: {
      day: 20,
      month: 9,
      year: 1990
    },
  }
};

data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
