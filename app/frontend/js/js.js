import config from './config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('isProd', isProd);

if (isProd) {
  console.log('config in module', config);
}

export {config};
