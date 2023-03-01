import LoggedInRecord, {
  LoggedInRecordInstance,
} from "../db/models/logged_in_record";
import { LoggedInRecordCreationAttributes } from "types";

/**
 * This function creates an user LoggedInRecordInstance in DB table logged_in_records
 * @param {LoggedInRecordCreationAttributes} attributes
 * @returns {Promise<LoggedInRecordInstance>}
 */
export const create = (
  attributes: LoggedInRecordCreationAttributes
): Promise<LoggedInRecordInstance> => {
  return LoggedInRecord.create(attributes);
};
