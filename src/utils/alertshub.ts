import axios from "axios";

export interface AlertsHubRequest {
  alert_key?: string | undefined;
  reference_id?: string;
  push_receivers?: Array<string>;
  push_title?: Array<string> | string;
  push_body?: Array<string> | string;
  push_data?: any;
  push_click_action?: string;
  to_emails?: Array<string>;
  email_subject?: Array<string> | string;
  email_body?: Array<string> | string;
  to_mobiles?: Array<string>;
  sms_body?: Array<string>;
}

const defaultAlertsHubRequest: AlertsHubRequest = {
  alert_key: process.env.ALERTS_HUB_AUTH_TOKEN,
};

export const alertHub = (payload: AlertsHubRequest) => {
  return new Promise((resolve, reject) => {
    let URL = process.env.ALERTS_HUB_URL;
    if (!URL) {
      return reject(new Error("ALERTS_HUB_URL is not available!"));
    }
    axios
      .post(URL, { ...defaultAlertsHubRequest, ...payload })
      .then(({ status, data }) => {
        if (status == 200) {
          return resolve({
            status: "Success",
            message: data?.message ?? "",
          });
        } else {
          reject({
            status: "Error",
            message: data?.message ?? "",
          });
        }
      })
      .catch(reject);
  });
};
