import { FastifyInstance } from "fastify";
import * as UserController from "../../../../controllers/user.controller";
import { loginSchema, signinSchema } from "./schema/user.login";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.post("/signup", { schema: signinSchema }, UserController.signIn);
  fastify.post(
    "/login",
    { schema: loginSchema },
    UserController.logIn(fastify)
  );
  done();
};

export default authRoutes;
