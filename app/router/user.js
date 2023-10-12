'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/login', controller.user.login);
  router.get('/api/validToken', controller.user.validToken);
  router.post('/api/register', controller.user.register);
  router.post('/api/changePassword', controller.user.changePassword);
  router.post('/api/resetPassword', controller.user.resetPassword);
};
