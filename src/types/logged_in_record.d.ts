import { Optional } from "sequelize";
export interface LoggedInRecordAttributes {
  id: bigint;
  user_id?: bigint;
  logger_details?: object;
  logged_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export type LoggedInRecordCreationAttributes = Optional<
  LoggedInAttributes,
  "id"
>;
