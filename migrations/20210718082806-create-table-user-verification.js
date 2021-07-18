'use strict';

const {
  DataTypes,
  DbTables
} = require("../config").constant;

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable(DbTables.UserVerification, {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    otp: { type: DataTypes.INTEGER, notNull: true },
    user_id: { type: DataTypes.INTEGER, notNull: true },
    is_revoked: { type: DataTypes.BOOLEAN, default: false, notNull: false },
    createdAt: { type: DataTypes.DATE_TIME, notNull: false },
    updatedAt: { type: DataTypes.DATE_TIME, notNull: false },
    deletedAt: { type: DataTypes.DATE_TIME, notNull: false },
  });
};

exports.down = function (db) {
  return db.dropTable(DbTables.UserVerification);
};

exports._meta = {
  "version": 1
};
