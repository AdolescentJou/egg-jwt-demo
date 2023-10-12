'use strict';

// const { isDev } = require('../utils');

module.exports = {
  schedule: {
    // immediate: false,
    // cron: '0 0 2 * * *', // 时间表达式 s ,m ,h ,day of month ,m ,day of week
    type: 'all',
    interval: '1m', // 1 分钟间隔
    // type: 'worker', // 指定单一 worker
  },
  async task() {
    console.log('定时打印', new Date().getTime());
  },
};
