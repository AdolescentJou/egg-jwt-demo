
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const User = app.model.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userName: {
      type: STRING(25),
      unique: true,
      allowNull: false,
      field: 'user_name',
    },
    userPassword: {
      type: STRING(50),
      field: 'user_password',
    },
    userMail: {
      type: STRING(50),
      field: 'user_mail',
    },
    createdAt: {
      type: DATE,
      field: 'created_at',
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updatedAt: {
      type: DATE,
      field: 'updated_at',
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  });
  return User;
};
