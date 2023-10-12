'use strict';

const { Controller } = require('egg');

class TodoController extends Controller {
  async test() {
    const ctx = this.ctx;

    ctx.body = {
      status: 'success',
    };
  }
}

module.exports = TodoController;
