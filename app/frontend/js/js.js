import config from './config';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('isProd', isProd);

if (process.env.NODE_ENV == 'development') {
  console.log('config in module', config);
}

export {config};
