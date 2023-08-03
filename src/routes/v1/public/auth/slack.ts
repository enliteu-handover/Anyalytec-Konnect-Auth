import { APP_URL } from "./../../../../constants";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import passport from "./../../../../utils/passport";

export const slackAuthRoutes = (
  fastify: FastifyInstance,
  _options: any,
  done: any
) => {
  fastify.get(
    "/",
    { schema: { tags: ["slack-auth"] } },
    async (requset: FastifyRequest, reply: FastifyReply) => {
      await passport.authenticate("Slack", {
        session: false,
      })(requset.raw, reply.raw, () => {});
    }
  );
  fastify.get(
    "/redirect",
    { schema: { tags: ["slack-auth"] } },
    (requset: FastifyRequest, reply: FastifyReply) => {
      passport.authenticate(
        "Slack",
        {
          session: false,
          failureRedirect: `${APP_URL}/login`,
        },
        (error: any, user: any) => {
          if (error) {
            console.error(error);
            return reply.redirect(`${APP_URL}/login`);
          }
          if (!user) {
            return reply.redirect(`${APP_URL}/login`);
          }
          return reply.redirect(user);
        }
      )(requset, reply, () => {});
    }
  );
  done();
};
