let _ = require('lodash');

export let utils = {
  util2: function () {}
};

class Service {
  constructor () {
    this.name = 'service2';
  }

  methodName () {
    var arr = _.map([1,2,3], (num) => num *2);
    arr.push(this.name);

    return arr;
  }
}

utils.service2 = new Service;
