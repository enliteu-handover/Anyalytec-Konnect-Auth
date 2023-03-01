import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply } from "fastify";

const authorizationMessages: any = {
  badRequestErrorMessage: `Format must be Authorization: Bearer <token>`,
  noAuthorizationInHeaderMessage: "Autorization header is missing!",
  authorizationTokenExpiredMessage: "token expired!",
  // for the below message you can pass a sync function that must return a string as shown or a string
  authorizationTokenInvalid: (err: any) => {
    return `Authorization token is invalid: ${err.message}`;
  },
};

export default fp(async (fastify: FastifyInstance, _) => {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
    messages: authorizationMessages,
    sign: {
      expiresIn: "1 day",
    },
  });
  fastify.decorate(
    "authenticate",
    async function (request: any, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(500).send(err);
      }
    }
  );
});
