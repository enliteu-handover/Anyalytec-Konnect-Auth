import { Optional } from "sequelize";
export interface UserAttributes {
  id: bigint;
  username?: string;
  email_id?: string;
  mobile_no_std_code?: number;
  mobile_no?: number;
  password?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;
