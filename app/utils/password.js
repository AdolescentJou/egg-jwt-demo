const crypto = require('crypto');

// 加盐加密
const SECRET_KEY = 'WJiol_8776#'; // 密匙是自定的，但需要保存好，如果是动态加盐，则需要和密码一起存储到数据库

// md5 加密
function md5(content) {
  const md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex'); // 把输出编程16进制的格式
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`; // 拼接方式是自定的，只要包含密匙即可
  return md5(str);
}

function checkPassword(serverPassword, password) {
  return serverPassword === genPassword(password);
}


module.exports = {
  genPassword,
  checkPassword,
};
