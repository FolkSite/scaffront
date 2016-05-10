let _ = require('lodash');

export let utils = {
  util1: function () {}
};

class Service {
  constructor () {
    this.name = 'service1';
  }

  methodName () {
    var arr = _.map([1,2,3], (num) => num *2);
    arr.push(this.name);

    return arr;
  }
}

utils.service1 = new Service;
