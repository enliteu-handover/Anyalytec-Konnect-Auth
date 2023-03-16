import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.get("/test", (req: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({
      success: true,
      message: "Successfully authenticated",
      data: req.body,
    });
  });
  done();
};

export default authRoutes;
