import {
  User,
  UserAttributes,
  UserCreationAttributes,
} from "../db/models/user";

/**
 * This function creates an UserInstance in DB table users
 * @param {UserCreationAttributes} attributes
 * @returns {Promise<User>}
 */
export const create = (attributes: UserCreationAttributes): Promise<User> => {
  return User.create(attributes);
};

/**
 * This function finds an unique UserInstance in DB table users
 * @param {UserAttributes} attributes
 * @returns {Promise<user>}
 */
export const findUnique = (
  attributes: UserAttributes
): Promise<User | null> => {
  let condition: any = {
    is_active: true,
  };
  Object.keys(attributes).forEach((key: string) => {
    const userAttributeKey = key as keyof UserAttributes;
    if (
      attributes[userAttributeKey] !== undefined &&
      userAttributeKey !== "password"
    ) {
      condition[userAttributeKey] = attributes[userAttributeKey];
    }
  });
  return User.findOne({ where: condition });
};
