var extend = require('extend');

var data = {
  title: 'Мои локации',
  profile: {
    name: 'Никита',
    last_name: 'Ласточкин',
    second_name: 'Викторович',
    bdate: {
      day: 7,
      month: 9,
      year: 1990
    },
    email: 'nikita@taskon.ru',
    phone: '+7 905 271-05-71',
    photo_id: '',
    photo_url: '/images/no_avatar.png'
  }
};

data = extend(true, {}, require('../_layouts/user-data'), data);
module.exports = data;
