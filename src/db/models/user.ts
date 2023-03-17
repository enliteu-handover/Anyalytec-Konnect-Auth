import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LoggedInRecord, LoggedInRecordId } from './logged_in_record';
import type { OtpToken, OtpTokenId } from './otp_token';

export interface UserAttributes {
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

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "username" | "email_id" | "mobile_no_std_code" | "mobile_no" | "password" | "is_active" | "is_deleted" | "created_at" | "updated_at";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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

  // User hasMany LoggedInRecord via user_id
  logged_in_records!: LoggedInRecord[];
  getLogged_in_records!: Sequelize.HasManyGetAssociationsMixin<LoggedInRecord>;
  setLogged_in_records!: Sequelize.HasManySetAssociationsMixin<LoggedInRecord, LoggedInRecordId>;
  addLogged_in_record!: Sequelize.HasManyAddAssociationMixin<LoggedInRecord, LoggedInRecordId>;
  addLogged_in_records!: Sequelize.HasManyAddAssociationsMixin<LoggedInRecord, LoggedInRecordId>;
  createLogged_in_record!: Sequelize.HasManyCreateAssociationMixin<LoggedInRecord>;
  removeLogged_in_record!: Sequelize.HasManyRemoveAssociationMixin<LoggedInRecord, LoggedInRecordId>;
  removeLogged_in_records!: Sequelize.HasManyRemoveAssociationsMixin<LoggedInRecord, LoggedInRecordId>;
  hasLogged_in_record!: Sequelize.HasManyHasAssociationMixin<LoggedInRecord, LoggedInRecordId>;
  hasLogged_in_records!: Sequelize.HasManyHasAssociationsMixin<LoggedInRecord, LoggedInRecordId>;
  countLogged_in_records!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany OtpToken via user_id
  otp_tokens!: OtpToken[];
  getOtp_tokens!: Sequelize.HasManyGetAssociationsMixin<OtpToken>;
  setOtp_tokens!: Sequelize.HasManySetAssociationsMixin<OtpToken, OtpTokenId>;
  addOtp_token!: Sequelize.HasManyAddAssociationMixin<OtpToken, OtpTokenId>;
  addOtp_tokens!: Sequelize.HasManyAddAssociationsMixin<OtpToken, OtpTokenId>;
  createOtp_token!: Sequelize.HasManyCreateAssociationMixin<OtpToken>;
  removeOtp_token!: Sequelize.HasManyRemoveAssociationMixin<OtpToken, OtpTokenId>;
  removeOtp_tokens!: Sequelize.HasManyRemoveAssociationsMixin<OtpToken, OtpTokenId>;
  hasOtp_token!: Sequelize.HasManyHasAssociationMixin<OtpToken, OtpTokenId>;
  hasOtp_tokens!: Sequelize.HasManyHasAssociationsMixin<OtpToken, OtpTokenId>;
  countOtp_tokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "custom_unique_users"
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "custom_unique_users"
    },
    mobile_no_std_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: "custom_unique_users"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "custom_unique_users",
        unique: true,
        fields: [
          { name: "username" },
          { name: "email_id" },
          { name: "mobile_no" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
