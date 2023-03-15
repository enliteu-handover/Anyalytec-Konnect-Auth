import type { Sequelize } from "sequelize";
import { loggedInRecord as _loggedInRecord } from "./logged_in_record";
import type { loggedInRecordAttributes, loggedInRecordCreationAttributes } from "./logged_in_record";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _loggedInRecord as loggedInRecord,
  _user as user,
};

export type {
  loggedInRecordAttributes,
  loggedInRecordCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const loggedInRecord = _loggedInRecord.initModel(sequelize);
  const user = _user.initModel(sequelize);

  loggedInRecord.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(loggedInRecord, { as: "logged_in_records", foreignKey: "user_id"});

  return {
    loggedInRecord: loggedInRecord,
    user: user,
  };
}
