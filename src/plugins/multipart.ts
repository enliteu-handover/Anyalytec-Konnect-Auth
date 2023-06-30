import fp from "fastify-plugin";
import multipart, { FastifyMultipartOptions } from "@fastify/multipart";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

const multipartPlugin: FastifyPluginAsync<FastifyMultipartOptions> = async (
  fastify: FastifyInstance,
  _options: any
) => {
  await fastify.register(multipart, {
    attachFieldsToBody: true,
  });
};

export default fp(multipartPlugin);
