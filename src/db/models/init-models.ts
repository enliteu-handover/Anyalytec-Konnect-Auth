import type { Sequelize } from "sequelize";
import { LoggedInRecord as _LoggedInRecord } from "./logged_in_record";
import type { LoggedInRecordAttributes, LoggedInRecordCreationAttributes } from "./logged_in_record";
import { OtpToken as _OtpToken } from "./otp_token";
import type { OtpTokenAttributes, OtpTokenCreationAttributes } from "./otp_token";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _LoggedInRecord as LoggedInRecord,
  _OtpToken as OtpToken,
  _User as User,
};

export type {
  LoggedInRecordAttributes,
  LoggedInRecordCreationAttributes,
  OtpTokenAttributes,
  OtpTokenCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const LoggedInRecord = _LoggedInRecord.initModel(sequelize);
  const OtpToken = _OtpToken.initModel(sequelize);
  const User = _User.initModel(sequelize);

  LoggedInRecord.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(LoggedInRecord, { as: "logged_in_records", foreignKey: "user_id"});
  OtpToken.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(OtpToken, { as: "otp_tokens", foreignKey: "user_id"});

  return {
    LoggedInRecord: LoggedInRecord,
    OtpToken: OtpToken,
    User: User,
  };
}
