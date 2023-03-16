import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { loggedInRecord, loggedInRecordId } from "./logged_in_record";
import type { otpToken, otpTokenId } from "./otp_token";

export interface userAttributes {
  id: number;
  username?: string;
  email_id?: string;
  mobile_no_std_code?: number;
  mobile_no?: number;
  password?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at: Date;
  updated_at: Date;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes =
  | "id"
  | "username"
  | "email_id"
  | "mobile_no_std_code"
  | "mobile_no"
  | "password"
  | "is_active"
  | "is_deleted"
  | "created_at"
  | "updated_at";
export type userCreationAttributes = Optional<
  userAttributes,
  userOptionalAttributes
>;

export class user
  extends Model<userAttributes, userCreationAttributes>
  implements userAttributes
{
  id!: number;
  username?: string;
  email_id?: string;
  mobile_no_std_code?: number;
  mobile_no?: number;
  password?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at!: Date;
  updated_at!: Date;

  // user hasMany loggedInRecord via user_id
  logged_in_records!: loggedInRecord[];
  getLogged_in_records!: Sequelize.HasManyGetAssociationsMixin<loggedInRecord>;
  setLogged_in_records!: Sequelize.HasManySetAssociationsMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  addLogged_in_record!: Sequelize.HasManyAddAssociationMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  addLogged_in_records!: Sequelize.HasManyAddAssociationsMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  createLogged_in_record!: Sequelize.HasManyCreateAssociationMixin<loggedInRecord>;
  removeLogged_in_record!: Sequelize.HasManyRemoveAssociationMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  removeLogged_in_records!: Sequelize.HasManyRemoveAssociationsMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  hasLogged_in_record!: Sequelize.HasManyHasAssociationMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  hasLogged_in_records!: Sequelize.HasManyHasAssociationsMixin<
    loggedInRecord,
    loggedInRecordId
  >;
  countLogged_in_records!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany otpToken via user_id
  otp_tokens!: otpToken[];
  getOtp_tokens!: Sequelize.HasManyGetAssociationsMixin<otpToken>;
  setOtp_tokens!: Sequelize.HasManySetAssociationsMixin<otpToken, otpTokenId>;
  addOtp_token!: Sequelize.HasManyAddAssociationMixin<otpToken, otpTokenId>;
  addOtp_tokens!: Sequelize.HasManyAddAssociationsMixin<otpToken, otpTokenId>;
  createOtp_token!: Sequelize.HasManyCreateAssociationMixin<otpToken>;
  removeOtp_token!: Sequelize.HasManyRemoveAssociationMixin<
    otpToken,
    otpTokenId
  >;
  removeOtp_tokens!: Sequelize.HasManyRemoveAssociationsMixin<
    otpToken,
    otpTokenId
  >;
  hasOtp_token!: Sequelize.HasManyHasAssociationMixin<otpToken, otpTokenId>;
  hasOtp_tokens!: Sequelize.HasManyHasAssociationsMixin<otpToken, otpTokenId>;
  countOtp_tokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: "custom_unique_users",
        },
        email_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: "custom_unique_users",
        },
        mobile_no_std_code: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mobile_no: {
          type: DataTypes.BIGINT,
          allowNull: true,
          unique: "custom_unique_users",
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn("now"),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn("now"),
        },
      },
      {
        sequelize,
        tableName: "users",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "custom_unique_users",
            unique: true,
            fields: [
              { name: "username" },
              { name: "email_id" },
              { name: "mobile_no" },
            ],
          },
          {
            name: "users_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
