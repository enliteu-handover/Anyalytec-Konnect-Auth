import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './user';
import config from './../config/config';

export interface LoggedInRecordAttributes {
  id: number;
  user_id?: number;
  logger_details?: object;
  logged_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type LoggedInRecordPk = "id";
export type LoggedInRecordId = LoggedInRecord[LoggedInRecordPk];
export type LoggedInRecordOptionalAttributes = "id" | "user_id" | "logger_details" | "logged_at" | "created_at" | "updated_at";
export type LoggedInRecordCreationAttributes = Optional<LoggedInRecordAttributes, LoggedInRecordOptionalAttributes>;

export class LoggedInRecord extends Model<LoggedInRecordAttributes, LoggedInRecordCreationAttributes> implements LoggedInRecordAttributes {
  id!: number;
  user_id?: number;
  logger_details?: object;
  logged_at?: Date;
  created_at!: Date;
  updated_at!: Date;

  // LoggedInRecord belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LoggedInRecord {
    return LoggedInRecord.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    logger_details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    logged_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'logged_in_records',
    schema: config.schema,
    timestamps: false,
    indexes: [
      {
        name: "logged_in_records_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
