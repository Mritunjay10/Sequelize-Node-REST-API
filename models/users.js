/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(225),
      allowNull: false,
      unique: true
    },
    user_phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active','inactive','deleted'),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    token: {
        type: DataTypes.VIRTUAL
    }
  }, {
    tableName: 'users'
  });
};
