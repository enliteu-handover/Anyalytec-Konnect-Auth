import { FastifyReply, FastifyRequest } from "fastify";

const token = process.env.TOKEN;

interface metaWebhookAuthenticatePayload {
  "hub.mode": string;
  "hub.verify_token": string;
  "hub.challenge": number;
}

interface metaWebhookMessage {
  object: string;
  entry: any;
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
    webhookPayload["hub.verify_token"] == token
  ) {
    reply.code(200).send(webhookPayload["hub.challenge"]);
  } else {
    reply.code(403).send();
  }
};

export const metaWebhookMessage = (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let message = req.body as metaWebhookMessage;
    if (message.object) {
      let userPhoneNumber =
        message.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
      console.log(userPhoneNumber);
      let messageBody =
        message.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
      console.log(messageBody);
    }
    reply.code(200).send();
  } catch (error) {
    console.error(error);
    reply.code(404).send();
  }
};
