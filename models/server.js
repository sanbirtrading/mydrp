// const { DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Server = sequelize.define(
    'Server',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      hard_disk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ram: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unique_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );
  Server.associate = function (models) {
    Server.belongsTo(models.User, {
      foreignKey: {
        name: 'server_owner',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    Server.belongsTo(models.Machine, {
      foreignKey: {
        name: 'machine_id',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  };
  return Server;
};
