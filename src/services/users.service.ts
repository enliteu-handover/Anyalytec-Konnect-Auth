import User, { UserInstance } from "../db/models/user";
import { UserAttributes, UserCreationAttributes } from "../types";

/**
 * This function creates an UserInstance in DB table users
 * @param {UserCreationAttributes} attributes
 * @returns {Promise<UserInstance>}
 */
export const create = (
  attributes: UserCreationAttributes
): Promise<UserInstance> => {
  return User.create(attributes);
};

/**
 * This function finds an unique UserInstance in DB table users
 * @param {UserAttributes} attributes
 * @returns {Promise<UserInstance>}
 */
export const findUnique = (
  attributes: UserAttributes
): Promise<UserInstance> => {
  let condition: any = {
    is_active: true,
  };
  Object.keys(attributes).forEach((key: string) => {
    if (attributes[key] !== undefined && key !== "password") {
      condition[key] = attributes[key];
    }
  });
  return User.findOne({ where: condition });
};
