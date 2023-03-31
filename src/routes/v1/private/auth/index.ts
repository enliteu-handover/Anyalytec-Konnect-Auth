import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { refreshUserSchema } from "./schema/user.schema";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  //If routes are private they are authenticated with the jwt middleware
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.get(
    "/refresh",
    { schema: refreshUserSchema },
    async (req: FastifyRequest, reply: FastifyReply) => {
      let { id, username, email_id } = req.user;
      reply.code(200).send({
        success: true,
        message: "Refreshed successfully!",
        data: {
          token: await reply.jwtSign({
            id,
            username,
            email_id,
          }),
        },
      });
    }
  );
  done();
};

export default authRoutes;
