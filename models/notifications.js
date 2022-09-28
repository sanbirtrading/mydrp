module.exports = function (sequelize, DataTypes) {
    const Notification = sequelize.define(
      'Notification',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        timestamps: false,
      }
    );
    Notification.associate = function (models) {
      Notification.belongsTo(models.User, {
        foreignKey: {
          name: 'receiver',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      });
    };
    return Notification;
  };
  