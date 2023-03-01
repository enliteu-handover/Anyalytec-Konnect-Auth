import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance, _) => {
  fastify.register(require("@fastify/cors"), {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
});
