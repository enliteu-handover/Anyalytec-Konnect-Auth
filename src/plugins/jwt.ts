import fp from "fastify-plugin";
import { FastifyPluginAsync, FastifyReply } from "fastify";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";

const authorizationMessages: any = {
  badRequestErrorMessage: `Format must be Authorization: Bearer <token>`,
  noAuthorizationInHeaderMessage: "Autorization header is missing!",
  authorizationTokenExpiredMessage: "token expired!",
  // for the below message you can pass a sync function that must return a string as shown or a string
  authorizationTokenInvalid: (err: any) => {
    return `Authorization token is invalid: ${err.message}`;
  },
};

interface UserData {
  id: string;
  username: string;
  email_id: string;
  iat?: number;
  exp?: number;
}

// Augment the FastifyInstance type
declare module "fastify" {
  interface FastifyInstance {
    authenticate: () => void;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserData;
  }
}

const jwtPlugin: FastifyPluginAsync<FastifyJWTOptions> = async (
  fastify: any
) => {
  fastify.register(fastifyJwt, {
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
};

export default fp(jwtPlugin);
