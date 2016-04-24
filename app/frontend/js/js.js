import config from './config';
import * as slice from 'sliced';
//require('babel-runtime/core-js/promise').default = require('bluebird');

console.log('slice', slice([1,2,3,4,5], 3));

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('isProd', isProd);
console.log('NODE_ENV', NODE_ENV);

if (isProd) {
  console.log('config in module', config);
}

export {config};


class Person {

}
