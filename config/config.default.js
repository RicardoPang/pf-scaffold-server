/* eslint valid-jsdoc: "off" */

'use strict';

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
      '/': {},
    },
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
