/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('activity_log', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    target_table: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    target_column: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('created','updated','deleted'),
      allowNull: false
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
    }
  }, {
    tableName: 'activity_log'
  });
};
