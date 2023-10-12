const LocalStrategy = require('passport-local').Strategy;
const { checkPassword } = require('./app/utils/password');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // config 文件已经被读取并合并，但是还并未生效，这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  configDidLoad() {
    // 所有的配置已经加载完毕，可以用来加载应用自定义的文件，启动自定义的服务
  }

  async didLoad() {
    // 所有的配置已经加载完毕，可以用来加载应用自定义的文件，启动自定义的服务
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    await this.app.runSchedule('console');

    // 设置鉴权配置
    this.app.passport.use(
      new LocalStrategy(
        {
          passReqToCallback: true,
          session: false,
        },
        (req, username, password, done) => {
          console.log(username, password);
          const user = {
            provider: 'local',
            username,
            password,
          };
          this.app.passport.doVerify(req, user, done);
        }
      )
    );

    // 处理用户信息
    this.app.passport.verify(async (ctx, user) => {
      const { username } = user;
      const query_uswer = await ctx.model.User.findOne({ where: { userName: username } });
      if (!query_uswer) {
        return null;
      }
      if (checkPassword(query_uswer.userPassword, user.password)) {
        return user;
      }
      return null;
    });
  }

  async didReady() {
    // 应用已经启动完毕
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
  }

  async beforeClose() {
    // 应用即将关闭
  }
}

module.exports = AppBootHook;
