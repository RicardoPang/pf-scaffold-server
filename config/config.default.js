/* eslint valid-jsdoc: "off" */

'use strict';

const {
  MYSQL_DB,
  MYSQL_PWD,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_HOST,
} = require('./db');

// local
const REDIS_PORT = 6379;
const REDIS_HOST = '127.0.0.1';
const REDIS_PWD = '';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1609077478115_7491';

  // add your middleware config here
  config.middleware = [];

  // add WebSocket Server config
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      },
      '/chat': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      },
    },
  };

  config.redis = {
    client: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PWD,
      db: 0,
    },
  };

  config.mysql = {
    client: {
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PWD,
      database: MYSQL_DB,
    },
    app: true,
    agent: false,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cluster = {
    listen: {
      port: 7001,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
