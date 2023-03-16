import { FastifyInstance } from "fastify";
import * as UserController from "../../../../controllers/user.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  signinSchema,
  verifyTokenSchema,
} from "./schema/user.schema";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.post("/signup", { schema: signinSchema }, UserController.signIn);
  fastify.post(
    "/login",
    { schema: loginSchema },
    UserController.logIn(fastify)
  );
  fastify.post(
    "/forgot_password",
    { schema: forgotPasswordSchema },
    UserController.forgotPassword
  );
  fastify.get(
    "/verify_token",
    { schema: verifyTokenSchema },
    UserController.verifyToken
  );
  done();
};

export default authRoutes;
