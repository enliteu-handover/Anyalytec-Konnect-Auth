import {
  metaAuthenticateWebhook,
  metaWebhookMessage,
} from "../../../../controllers/whatsapp.controller";
import { FastifyInstance } from "fastify";

const webhookRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.get(
    "/whatsapp",
    { schema: { tags: ["webhook"] } },
    metaAuthenticateWebhook
  );
  fastify.post(
    "/whatsapp",
    { schema: { tags: ["webhook"] } },
    metaWebhookMessage
  );
  done();
};

export default webhookRoutes;
