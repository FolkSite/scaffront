/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const config = {
  mode: process.env.NODE_ENV || 'development',
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
  isProd: process.env.NODE_ENV == 'production',
  debug: process.env.DEBUG == 'true'
};

module.exports = config;
