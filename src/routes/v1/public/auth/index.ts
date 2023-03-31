import { FastifyInstance } from "fastify";
import * as UserController from "../../../../controllers/user.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  preValidateUserSchema,
  resetPasswordSchema,
  signinSchema,
  verifyTokenSchema,
} from "./schema/user.schema";

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.post(
    "/prevalidate_user",
    { schema: preValidateUserSchema },
    UserController.preValidateSignUp
  );
  fastify.post("/signup", { schema: signinSchema }, UserController.signIn);
  fastify.post("/login", { schema: loginSchema }, UserController.logIn);
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
  fastify.post(
    "/reset_password",
    { schema: resetPasswordSchema },
    UserController.resetPassword
  );
  done();
};

export default authRoutes;
