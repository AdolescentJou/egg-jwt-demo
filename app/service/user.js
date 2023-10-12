const Service = require('egg').Service;

class UserService extends Service {
  async createUser(user) {
    try {
      const res = await this.ctx.model.User.create(user);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findUser(username) {
    try {
      const res = await this.ctx.model.User.findOne({
        where: {
          userName: username,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser(username, options) {
    try {
      const res = await this.ctx.model.User.update(options, {
        where: {
          userName: username,
        },
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
