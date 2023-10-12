const { decodeToken, isValidToken } = require('../utils/token');

function isNeedAuth(url) {
  // 不需要认证的接口列表
  const whiteUrls = [
    '/api/login',
    '/api/validToken',
    '/api/register',
    '/api/resetPassword',
  ];

  return !whiteUrls.some(wUrl => url.includes(wUrl));
}

function checkDomainValid(domain) {
  const domainList = global.apollo.application['sso.domain.list'].split(',');

  return Array.from(new Set([ ...domainList, '127.0.0.1', 'localhost' ])).includes(domain);
}

module.exports = () => {
  return async function authHander(ctx, next) {
    console.log('----------auth------------');
    const request = ctx.request;
    const config = ctx.app.config;
    const auth = request.headers.authorization ?? '';

    const isValid = isValidToken(auth, config.jwt.secret);

    const url = request.url;
    const needAuth = isNeedAuth(url);

    if (url === '/user/ssoCheckLogin') {
      const hostname = request.body.hostname;
      if (!checkDomainValid(hostname)) {
        ctx.body = {
          status: {
            code: 11,
            des: '域名' + hostname + '未被授权',
          },
        };
        ctx.status = 200;
        return;
      }
    }

    if (needAuth && !isValid) {
      ctx.body = {
        status: {
          code: 13,
          des: '认证失效',
        },
      };
      ctx.status = 200;
      return;
    }

    if (auth) {
      const tokenInfo = decodeToken(auth, config.jwt.secret);

      if (!tokenInfo) {
        ctx.body = {
          status: {
            code: 13,
            des: '认证失效',
          },
        };
        ctx.status = 200;
        return;
      }

      // if (![ 'local', 'dev', 'development' ].includes(config.env)) {
      //   if ((tokenInfo.payload.data)?.env !== config.env) {
      //     ctx.body = {
      //       status: {
      //         code: 14,
      //         des: 'token 无效，token 签发环境与当前环境不一致',
      //       },
      //     };
      //     ctx.status = 200;
      //     return;
      //   }
      // }

      ctx.loginUserInfo = tokenInfo.payload.data;
    }

    await next();
  };
};
