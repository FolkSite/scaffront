var extend = require('extend');

var data = {
  pageMenu: [{
    classes: 'pull-right muted',
    isActive: false,
    href: '#',
    title: 'Удалить аккаунт',
  }, {
    classes: '',
    isActive: false,
    href: '#',
    title: 'Профиль',
    badge: {
      isActive: true,
      content: 10,
    }
  }, {
    isActive: true,
    href: '#',
    title: 'Локация',
    badge: {
      isActive: false,
      content: 10100,
    }
  }, {
    isActive: false,
    href: '#',
    title: 'Навыки',
    badge: {
      isActive: false,
      content: 5,
    }
  }, {
    isActive: false,
    href: '#',
    title: 'Паспорт',
    badge: {
      isActive: true,
      content: 1,
    }
  }, {
    isActive: false,
    href: '#',
    title: 'Кошелёк',
  }, {
    isActive: false,
    href: '#',
    title: 'Синхронизация',
  }, {
    isActive: false,
    href: '#',
    title: 'Пароль',
  }],
};


data = extend(true, {}, require('./default-data'), data);
module.exports = data;