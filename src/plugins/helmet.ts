import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance, _) => {
  fastify.register(require("@fastify/helmet"), {
    hidePoweredBy: true,
  });
});
