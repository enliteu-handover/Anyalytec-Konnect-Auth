import { FastifyInstance } from "fastify";
import * as UserController from "../../../../controllers/user.controller";
import * as OTPController from "../../../../controllers/otp.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  preValidateUserSchema,
  resetPasswordSchema,
  signinSchema,
  verifyTokenSchema,
  sendOTPSchema,
  verifyOTPSchema,
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
  fastify.post("/send_otp", { schema: sendOTPSchema }, OTPController.sendOtp);
  fastify.post(
    "/verify_otp",
    { schema: verifyOTPSchema },
    OTPController.verifyOtp
  );
  fastify.post(
    "/resend_otp",
    { schema: sendOTPSchema },
    OTPController.resendOtp
  );
  done();
};

export default authRoutes;
