import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface otpTokenAttributes {
  id: number;
  user_id?: number;
  otp?: number;
  token?: string;
  valid_till?: Date;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at: Date;
  updated_at: Date;
}

export type otpTokenPk = "id";
export type otpTokenId = otpToken[otpTokenPk];
export type otpTokenOptionalAttributes =
  | "id"
  | "user_id"
  | "otp"
  | "token"
  | "valid_till"
  | "is_active"
  | "is_deleted"
  | "created_at"
  | "updated_at";
export type otpTokenCreationAttributes = Optional<
  otpTokenAttributes,
  otpTokenOptionalAttributes
>;

export class otpToken
  extends Model<otpTokenAttributes, otpTokenCreationAttributes>
  implements otpTokenAttributes
{
  id!: number;
  user_id?: number;
  otp?: number;
  token?: string;
  valid_till?: Date;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at!: Date;
  updated_at!: Date;

  // otpToken belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof otpToken {
    return otpToken.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
        },
        otp: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        valid_till: {
          type: DataTypes.DATE,
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
        tableName: "otp_tokens",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "otp_tokens_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
