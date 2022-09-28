// const { DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const IPWhitelist = sequelize.define(
    'IPWhitelist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_whitelisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );
  IPWhitelist.associate = function (models) {
    IPWhitelist.belongsTo(models.User, {
      foreignKey: {
        name: 'ip_owner',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  };

  return IPWhitelist;
};
