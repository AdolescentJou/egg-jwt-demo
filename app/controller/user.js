'use strict';

const { Controller } = require('egg');
const { genPassword, checkPassword } = require('../utils/password');
const { createToken, decodeToken } = require('../utils/token');
class UserController extends Controller {
  async login() {
    const ctx = this.ctx;
    const config = ctx.app.config;
    const { username } = ctx.request.body;
    // 入参数校验
    try {
      ctx.validate({
        username: {
          type: 'string',
          min: 1,
          max: 32,
        },
        password: {
          type: 'string',
          min: 1,
          max: 32,
        },
      });
    } catch (e) {
      ctx.body = { msg: e.errors[0].message };
      return;
    }

    const token = createToken(
      {
        username,
      },
      config.jwt.exp,
      config.jwt.secret
    );

    try {
      await this.app.passport.authenticate('local', {
        successRedirect: `/api/validToken?redirectToken=${encodeURIComponent(token)}`,
      })(ctx);
    } catch (e) {
      ctx.body = { msg: '登录失败, 用户名或密码错误' };
    }
  }

  async validToken() {
    const ctx = this.ctx;
    const config = ctx.app.config;
    const { redirectToken } = ctx.query;

    try {
      ctx.validate(
        {
          redirectToken: {
            type: 'string',
          },
        },
        ctx.query
      );
    } catch (e) {
      ctx.body = { msg: 'redirectToken 无效' };
      return;
    }

    const tokenInfo = decodeToken(redirectToken, config.jwt.secret);
    if (!tokenInfo) {
      ctx.body = { msg: 'redirectToken 无效' };
      return;
    }

    const loginUser = tokenInfo.payload.data.username;

    ctx.body = {
      username: loginUser,
      token: redirectToken,
    };
  }

  async register() {
    const ctx = this.ctx;
    const { username, password, email } = ctx.request.body;
    // 入参数校验
    try {
      ctx.validate(
        {
          username: {
            type: 'string',
            min: 1,
            max: 32,
          },
          password: {
            type: 'string',
            min: 1,
            max: 32,
          },
          email: {
            type: 'string',
            min: 1,
            max: 32,
          },
        },
        ctx.request.body
      );
    } catch (e) {
      ctx.body = { msg: e.errors[0].message };
      return;
    }

    const findUser = await ctx.service.user.findUser(username);

    if (findUser) {
      ctx.body = { msg: '用户已存在' };
      return;
    }

    const res = await ctx.service.user.createUser({
      userName: username,
      userPassword: genPassword(password),
      userMail: email,
    });

    if (res) {
      ctx.body = { msg: '注册成功' };
      return;
    }
    ctx.body = { msg: '注册失败' };
  }

  async changePassword() {
    const ctx = this.ctx;
    const auth = ctx.request.headers.authorization ?? '';
    const config = ctx.app.config;
    const { oldPassword, newPassword } = ctx.request.body;
    // 入参数校验
    try {
      ctx.validate(
        {
          oldPassword: {
            type: 'string',
            min: 1,
            max: 32,
          },
          newPassword: {
            type: 'string',
            min: 1,
            max: 32,
          },
        },
        ctx.request.body
      );
    } catch (e) {
      ctx.body = { msg: e.errors[0].message };
      return;
    }

    const userInfo = decodeToken(auth, config.jwt.secret);
    const user = userInfo.payload.data;
    const query_user = await ctx.service.user.findUser(user.username);

    if (!checkPassword(query_user.userPassword, oldPassword)) {
      ctx.body = { msg: '请输入正确旧密码' };
      return;
    }

    const res_user = await ctx.service.user.updateUser(user.username, {
      userPassword: genPassword(newPassword),
    });

    if (res_user) {
      ctx.body = { msg: '修改密码成功' };
    } else {
      ctx.body = { msg: '修改密码失败' };
    }
  }

  async resetPassword() {
    const ctx = this.ctx;
    const { username, password, email } = ctx.request.body;
    // 入参数校验
    try {
      ctx.validate(
        {
          username: {
            type: 'string',
            min: 1,
            max: 32,
          },
          password: {
            type: 'string',
            min: 1,
            max: 32,
          },
          email: {
            type: 'string',
            min: 1,
            max: 32,
          },
          verifyCode: {
            type: 'string',
            min: 1,
            max: 32,
          },
        },
        ctx.request.body
      );
    } catch (e) {
      ctx.body = { msg: e.errors[0].message };
      return;
    }

    const query_user = await ctx.service.user.findUser(username);

    if (!query_user) {
      ctx.body = { msg: '不存在用户' };
      return;
    }

    // 模拟验证码逻辑
    if (email !== query_user.userMail) {
      ctx.body = { msg: '邮箱错误' };
      return;
    }

    const res_user = await ctx.service.user.updateUser(username, {
      userPassword: genPassword(password),
    });

    if (res_user) {
      ctx.body = { msg: '重置密码成功' };
    } else {
      ctx.body = { msg: '重置密码失败' };
    }
  }
}

module.exports = UserController;
