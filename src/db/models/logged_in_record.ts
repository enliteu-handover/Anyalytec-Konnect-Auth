import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface loggedInRecordAttributes {
  id: number;
  user_id?: number;
  logger_details?: object;
  logged_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type loggedInRecordPk = "id";
export type loggedInRecordId = loggedInRecord[loggedInRecordPk];
export type loggedInRecordOptionalAttributes = "id" | "user_id" | "logger_details" | "logged_at" | "created_at" | "updated_at";
export type loggedInRecordCreationAttributes = Optional<loggedInRecordAttributes, loggedInRecordOptionalAttributes>;

export class loggedInRecord extends Model<loggedInRecordAttributes, loggedInRecordCreationAttributes> implements loggedInRecordAttributes {
  id!: number;
  user_id?: number;
  logger_details?: object;
  logged_at?: Date;
  created_at!: Date;
  updated_at!: Date;

  // loggedInRecord belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof loggedInRecord {
    return loggedInRecord.init({
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
    schema: 'public',
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
