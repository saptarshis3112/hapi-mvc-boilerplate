const { DataTypes } = require("sequelize");

const { sequelize } = require("../config");
const { DbTables } = require("../config").constant;

const User = require("./users");

const UserVerification = sequelize.define(DbTables.UserVerification, {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: DbTables.UserVerification,
});

UserVerification.belongsTo(User, { foreignKey: "user_id" });

module.exports = UserVerification;
