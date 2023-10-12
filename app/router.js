'use strict';

const user = require('./router/user');
const todo = require('./router/todo');

module.exports = app => {
  user(app);
  todo(app);
};
