import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyHelmet, { FastifyHelmetOptions } from "@fastify/helmet";

const helmentPlugin: FastifyPluginAsync<FastifyHelmetOptions> = async (
  fastify: any
) => {
  fastify.register(fastifyHelmet, {
    hidePoweredBy: true,
  });
};

export default fp(helmentPlugin);
