// const { DataTypes } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Machine = sequelize.define(
    'Machine',
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hard_disk: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
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
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Machine.associate = function (models) {
    Machine.belongsTo(models.User, {
      foreignKey: {
        name: 'machine_owner',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    Machine.hasMany(models.Server, {
      foreignKey: 'machine_id',
      onDelete: 'CASCADE',
    });
  };

  return Machine;
};
