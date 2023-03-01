import { FastifyInstance, FastifyReply } from "fastify";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.get("/test", (_, reply: FastifyReply) => {
    reply.code(200).send({
      success: true,
      message: "Successfully authenticated",
    });
  });
  done();
};

export default authRoutes;
