import type { Sequelize } from "sequelize";
import { loggedInRecord as _loggedInRecord } from "./logged_in_record";
import type {
  loggedInRecordAttributes,
  loggedInRecordCreationAttributes,
} from "./logged_in_record";
import { otpToken as _otpToken } from "./otp_token";
import type {
  otpTokenAttributes,
  otpTokenCreationAttributes,
} from "./otp_token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _loggedInRecord as loggedInRecord,
  _otpToken as otpToken,
  _user as user,
};

export type {
  loggedInRecordAttributes,
  loggedInRecordCreationAttributes,
  otpTokenAttributes,
  otpTokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const loggedInRecord = _loggedInRecord.initModel(sequelize);
  const otpToken = _otpToken.initModel(sequelize);
  const user = _user.initModel(sequelize);

  loggedInRecord.belongsTo(user, { as: "user", foreignKey: "user_id" });
  user.hasMany(loggedInRecord, {
    as: "logged_in_records",
    foreignKey: "user_id",
  });
  otpToken.belongsTo(user, { as: "user", foreignKey: "user_id" });
  user.hasMany(otpToken, { as: "otp_tokens", foreignKey: "user_id" });

  return {
    loggedInRecord: loggedInRecord,
    otpToken: otpToken,
    user: user,
  };
}
