export let utils = {
  util2: function () {}
};

class Service {
  constructor () {
    this.name = 'service2';
  }
}

utils.service2 = new Service;
