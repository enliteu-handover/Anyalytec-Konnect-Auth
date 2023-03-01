import { DataTypes, Model } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../../types";

import { sequelize } from "./index";

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User: UserInstance = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
    },
    email_id: {
      type: DataTypes.STRING,
    },
    mobile_no_std_code: {
      type: DataTypes.NUMBER,
    },
    mobile_no: {
      type: DataTypes.NUMBER,
    },
    password: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "users",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;
