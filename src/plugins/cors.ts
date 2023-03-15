import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import fastifyCors, { FastifyCorsOptions } from "@fastify/cors";

const corsPlugin: FastifyPluginAsync<FastifyCorsOptions> = async (
  fastify: any,
  _
) => {
  fastify.register(fastifyCors, {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
};

export default fp(corsPlugin);
