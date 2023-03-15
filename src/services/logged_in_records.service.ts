import {
  loggedInRecord,
  loggedInRecordCreationAttributes,
} from "../db/models/logged_in_record";

/**
 * This function creates an user LoggedInRecordInstance in DB table logged_in_records
 * @param {loggedInRecordCreationAttributes} attributes
 * @returns {Promise<loggedInRecord>}
 */
export const create = (
  attributes: loggedInRecordCreationAttributes
): Promise<loggedInRecord> => {
  return loggedInRecord.create(attributes);
};
