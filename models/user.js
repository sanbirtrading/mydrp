// const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_manager: { type: DataTypes.BOOLEAN, defaultValue: false },
      parent_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        notEmpty: true,
      },
      parent_user: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      timestamps: true,
    }
  );
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  User.associate = function (models) {
    User.hasMany(models.Server, {
      foreignKey: 'server_owner',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Request, {
      foreignKey: 'request_issuer',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.IPWhitelist, {
      foreignKey: 'ip_owner',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Machine, {
      foreignKey: 'machine_owner',
      onDelete: 'CASCADE',
    });
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.beforeCreate(async (user) => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
