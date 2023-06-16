import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { refreshUserSchema, resetPasswordSchema } from "./schema/user.schema";
import { loggedInResetPassword } from "./../../../../controllers/user.controller";

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
  fastify.patch(
    "/reset_password",
    { schema: resetPasswordSchema },
    loggedInResetPassword
  );
  done();
};

export default authRoutes;
