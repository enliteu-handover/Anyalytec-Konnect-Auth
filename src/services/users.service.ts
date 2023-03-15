import {
  user,
  userAttributes,
  userCreationAttributes,
} from "../db/models/user";

/**
 * This function creates an UserInstance in DB table users
 * @param {userCreationAttributes} attributes
 * @returns {Promise<user>}
 */
export const create = (attributes: userCreationAttributes): Promise<user> => {
  return user.create(attributes);
};

/**
 * This function finds an unique UserInstance in DB table users
 * @param {userAttributes} attributes
 * @returns {Promise<user>}
 */
export const findUnique = (
  attributes: userAttributes
): Promise<user | null> => {
  let condition: any = {
    is_active: true,
  };
  Object.keys(attributes).forEach((key: string) => {
    const userAttributeKey = key as keyof userAttributes;
    if (
      attributes[userAttributeKey] !== undefined &&
      userAttributeKey !== "password"
    ) {
      condition[userAttributeKey] = attributes[userAttributeKey];
    }
  });
  return user.findOne({ where: condition });
};
