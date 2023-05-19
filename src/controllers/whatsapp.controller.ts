import { WHATSAPP_MESSAGE_FOR_AUTH } from "./../constants";
import { FastifyReply, FastifyRequest } from "fastify";
import * as UserService from "../services/users.service";
import { splitMobileNoandSTDCode } from "../utils/common";
import { UserAttributes } from "../db/models/user";
import { sendWhatsappMessage } from "../services/whatsapp.service";

interface metaWebhookAuthenticatePayload {
  "hub.mode": string;
  "hub.verify_token": string;
  "hub.challenge": number;
}

interface metaWebhookMessage {
  object: "whatsapp_business_account";
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: "whatsapp";
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts: {
          profile: {
            name: string;
          };
          wa_id: string;
        }[];
        messages: {
          from: string;
          id: string;
          timestamp: string;
          text: {
            body: string;
          };
          type: "text";
        }[];
      };
      field: "messages";
    }[];
  }[];
}

/**
 * This webhook authenticates the incoming requests from meta
 */
export const metaAuthenticateWebhook = (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  let webhookPayload = req.query as metaWebhookAuthenticatePayload;
  if (
    webhookPayload["hub.mode"] == "subscribe" &&
    webhookPayload["hub.verify_token"] == process.env.META_WEBHOOK_TOKEN
  ) {
    reply.code(200).send(webhookPayload["hub.challenge"]);
  } else {
    reply.code(403).send();
  }
};

/**
 * This Webhook recieves incomming messages and status updates
 */
export const metaWebhookMessage = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let message = req.body as metaWebhookMessage;
    if (message.object) {
      let userPhoneNumber =
        message.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
      let messageBody =
        message.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
      if (userPhoneNumber && messageBody == WHATSAPP_MESSAGE_FOR_AUTH) {
        let { mobile_no_std_code, mobile_no } =
          splitMobileNoandSTDCode(userPhoneNumber);
        let userInstance = await UserService.findUnique({
          mobile_no,
        } as UserAttributes);
        if (!userInstance) {
          userInstance = await UserService.create({
            mobile_no_std_code,
            mobile_no,
          });
        }
        let messageBody: string = `Click to continue ${
          process.env.WEBAPP_BASE_URL
        }?auth_token=${await reply.jwtSign({
          id: userInstance.id,
          username: userInstance.username,
          email_id: userInstance.email_id,
        })}`;
        let whatsappResponse: any = await sendWhatsappMessage({
          userPhoneNumber,
          messageBody,
        });        
        await userInstance.createLogged_in_record({
          logged_at: new Date(),
          logger_details: {
            logged_in: "success",
            requested_ip_address: req.ip,
            wamid: whatsappResponse?.messages?.[0]?.id,
          },
        });
      }
    }
    reply.code(200).send();
  } catch (error) {
    console.error(error);
    reply.code(404).send();
  }
};
