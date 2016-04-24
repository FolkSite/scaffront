export let utils = {
  util1: function () {}
};

class Service {
  constructor () {
    this.name = 'service1';
  }
}

utils.service1 = new Service;
