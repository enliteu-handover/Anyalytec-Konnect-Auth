import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  //If routes are private they are authenticated with the jwt middleware
  fastify.addHook("preHandler", fastify.authenticate);
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
