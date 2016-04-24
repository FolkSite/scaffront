import config from './config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('isProd', isProd);
console.log('NODE_ENV', NODE_ENV);

if (isProd) {
  console.log('config in module', config);
}

export {config};
