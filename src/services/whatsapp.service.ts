import axios from "axios";
import { WHATSAPP_MESSAGE_ENDPOINT } from "./../constants";

interface WhatsAppMessage {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: "text";
  text: {
    preview_url: boolean;
    body: string;
  };
}

const getMetaGraphURL = (): string => {
  let { META_API_URL, META_API_VERSION, WHATSAPP_BUISNESS_PHONE_NUMBER } =
    process.env;
  return `${META_API_URL}/${META_API_VERSION}/${WHATSAPP_BUISNESS_PHONE_NUMBER}`;
};

export const sendWhatsappMessage = ({ userPhoneNumber, messageBody }: any) => {
  let bodyParams: WhatsAppMessage = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    type: "text",
    to: userPhoneNumber,
    text: {
      preview_url: false,
      body: messageBody,
    },
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${getMetaGraphURL()}${WHATSAPP_MESSAGE_ENDPOINT}`, bodyParams, {
        headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` },
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch(reject);
  });
};
