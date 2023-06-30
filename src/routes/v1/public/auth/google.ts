import { APP_URL } from "./../../../../constants";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import passport from "./../../../../utils/passport";

export const googleAuthRoutes = (
  fastify: FastifyInstance,
  _options: any,
  done: any
) => {
  fastify.get(
    "/",
    { schema: { tags: ["google-auth"] } },
    async (requset: FastifyRequest, reply: FastifyReply) => {
      await passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
      })(requset.raw, reply.raw, () => {});
    }
  );
  fastify.get(
    "/redirect",
    { schema: { tags: ["google-auth"] } },
    async (requset: FastifyRequest, reply: FastifyReply) => {
      try {
        let user = await passport.authenticate("google", {
          session: false,
          failureRedirect: `${APP_URL}/login`,
        })(requset, reply, () => {});
        if (!user) {
          reply.redirect(`${APP_URL}/login`);
          return;
        }
        reply.redirect(user);
      } catch (error) {
        console.error(error);
        reply.redirect(`${APP_URL}/login`);
      }
    }
  );
  done();
};
