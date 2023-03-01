import { DataTypes, Model } from "sequelize";
import {
  LoggedInRecordAttributes,
  LoggedInRecordCreationAttributes,
} from "../../types";

import { sequelize } from "./index";
import User from "./user";

export interface LoggedInRecordInstance
  extends Model<LoggedInRecordAttributes, LoggedInRecordCreationAttributes>,
    LoggedInRecordAttributes {}

const LoggedInRecord: LoggedInRecordInstance = sequelize.define(
  "LoggedInRecord",
  {
    user_id: {
      type: DataTypes.BIGINT,
    },
    logger_details: {
      type: DataTypes.JSON,
    },
    logged_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "logged_in_records",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

LoggedInRecord.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});
User.hasMany(LoggedInRecord, {
  foreignKey: "user_id",
  as: "logged_in_records",
});

export default LoggedInRecord;
