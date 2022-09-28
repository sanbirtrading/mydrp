// const { DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Request = sequelize.define(
    'Request',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      request_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      resolved: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
    }
  );
  Request.associate = function (models) {
    Request.belongsTo(models.User, {
      foreignKey: {
        name: 'request_issuer',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  };
  return Request;
};
