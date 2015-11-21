global.isProduction = (process.env.NODE_ENV === 'production');
global.environment = (global.isProduction) ? 'production' : 'development';

global.isWatching = false;

console.log('global.environment', global.environment);
