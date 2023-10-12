/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1694056696065_4861';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'authHandler' ];

  // 单独设置中间件匹配执行的路由
  config.errorHanlder = {
    enable: true,
    // match: '/user/findUserByUserId',
    // ignore: '/user/findUserByUserId',
  };

  config.authHanlder = {
    enable: true,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 关闭crsf,开启跨域
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [],
  };

  // 允许跨域方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT,  POST, DELETE, PATCH',
  };

  // 参数校验
  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };

  // 数据库链接
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'liveforme27.',
    port: 3306,
    database: 'test_db',
  };

  config.passportLocal = {
    key: 'g',
    secret: 'h',
    usernameField: 'username',
    passwordField: 'password',
  };

  config.jwt = {
    secret: 'token',
    // 有效期 单位 秒
    exp: 3 * 24 * 60 * 60,
  };

  return {
    ...config,
    ...userConfig,
  };
};
