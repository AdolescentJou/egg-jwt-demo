'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  valparams: {
    enable: true,
    package: 'egg-valparams',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  // config/plugin.js
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportLocal: {
    enable: true,
    package: 'passport-local',
  },
};
