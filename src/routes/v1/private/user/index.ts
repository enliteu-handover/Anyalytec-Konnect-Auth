import {
  bulkUserRegistration,
  resetUserPassword,
} from "./../../../../controllers/user.controller";
import { FastifyInstance } from "fastify";
import { bulkUserRegistrationSchema, resetPassword } from "./schema";

const userRoutes = (fastify: FastifyInstance, _options: any, done: any) => {
  //If routes are private they are authenticated with the jwt middleware
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.post(
    "/bulk_user_registration",
    { schema: bulkUserRegistrationSchema },
    bulkUserRegistration
  );
  fastify.patch(
    "/reset_password/:user_id",
    { schema: resetPassword },
    resetUserPassword
  );
  done();
};

export default userRoutes;
