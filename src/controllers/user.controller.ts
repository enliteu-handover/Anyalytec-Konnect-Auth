import { FastifyRequest, FastifyReply } from "fastify";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import * as UserService from "../services/users.service";
import { OtpToken, User, UserAttributes } from "./../db/models/init-models";
import { DEFAULT_TOKEN_VALIDITY, LOG_STATUS } from "./../constants";
import { TOKEN_CONSTANTS, validateToken } from "./../services/otptoken.service";
import { ResetPasswordBody } from "./../types/request_body";

const generateHashedPassword = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

/**
 * This controller is create a new User and provide access to the same
 */
export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const attributes = req.body as UserAttributes;
    let userInstance: User | null = await UserService.findUnique(attributes);
    if (userInstance) {
      return reply.conflict("User already exists!");
    }
    const hashedPassword = generateHashedPassword(attributes.password!);
    userInstance = await UserService.create({
      ...attributes,
      password: hashedPassword,
    });
    delete userInstance?.dataValues.password;
    reply.code(200).send({
      success: true,
      message: "Successfully created User!",
      data: { user: userInstance },
    });
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

/**
 * This login controller validates user credentials and provides access for the same
 */
export const logIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const attributes = req.body as UserAttributes;

    // Default constraints to make sure accessible user logs in
    attributes.is_active = true;
    attributes.is_deleted = false;

    const userInstance: User | null = await UserService.findUnique(attributes);
    if (!userInstance) {
      return reply.forbidden("Please check credentials");
    }
    if (userInstance?.password) {
      if (compareSync(attributes.password!, userInstance.password)) {
        await userInstance.createLogged_in_record({
          logged_at: new Date(),
          logger_details: {
            logged_in: LOG_STATUS.SUCCESS,
            requested_ip_address: req.ip,
          },
        });
        delete userInstance.dataValues.password;
        reply.code(200).send({
          success: true,
          message: "Logged in successfully!",
          data: {
            user: userInstance,
            token: await reply.jwtSign({
              id: userInstance.id,
              username: userInstance.username,
              email_id: userInstance.email_id,
            }),
          },
        });
      } else {
        reply.forbidden("Password does not match!");
      }
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

/** This controller checks and initiates forget password  */
export const forgotPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const attributes = req.body as UserAttributes;
    const userInstance: User | null = await UserService.findUnique(attributes);
    if (!userInstance) {
      reply.forbidden("No Such User Exists!");
    } else {
      let tempDate: Date = new Date();
      tempDate = new Date(
        tempDate.setMinutes(tempDate.getMinutes() + DEFAULT_TOKEN_VALIDITY)
      );
      let token: string = await reply.jwtSign(
        { email_id: userInstance.email_id },
        { expiresIn: DEFAULT_TOKEN_VALIDITY }
      );
      await userInstance.createOtp_token({
        token: token,
        valid_till: tempDate,
      });
      reply.code(200).send({
        success: true,
        data: {
          token: token,
          valid_till: tempDate,
        },
      });
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

/** This controller validates token to reset password  */
export const verifyToken = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      reply.forbidden("Missing Authorisation Token!");
    }
    reply.code(200).send(await validateToken({ token: token }));
  } catch (error: any) {
    console.error(error);
    if (error.message == TOKEN_CONSTANTS.INVALID) {
      reply.forbidden(TOKEN_CONSTANTS.INVALID);
    } else {
      reply.internalServerError(error.message);
    }
  }
};

/** This Controller Resets passowrd for the requested user */
export const resetPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      reply.forbidden("Missing Authorisation Token!");
    }

    let { new_password } = req.body as ResetPasswordBody;

    let status: any = await validateToken({ token });
    if (status.success) {
      let otpTokenInstance: OtpToken | null = await OtpToken.findOne({
        where: { token },
      });
      const hashedPassword = generateHashedPassword(new_password);
      let userInstance: User | undefined = await otpTokenInstance?.getUser();
      userInstance?.set("password", hashedPassword);
      await userInstance?.save();
      await otpTokenInstance?.destroy();
      reply.code(200).send({
        success: true,
        message: "Password Reset Successfully!",
      });
    } else {
      reply.forbidden(TOKEN_CONSTANTS.INVALID);
    }
  } catch (error: any) {
    console.error(error);
    if (error.message == TOKEN_CONSTANTS.INVALID) {
      reply.forbidden(TOKEN_CONSTANTS.INVALID);
    } else {
      reply.internalServerError(error.message);
    }
  }
};

/** This Controller checks whether user exists or not*/
export const preValidateSignUp = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const attributes = req.body as UserAttributes;
    const userInstance: User | null = await UserService.findUnique(attributes);
    if (userInstance) {
      reply.conflict("User already exists!");
    } else {
      reply.code(200).send({
        success: true,
        message: "User available to create!",
      });
    }
  } catch (error: any) {
    reply.internalServerError(error.message);
  }
};

/** This Controller checks existing password and updates the same  */
export const loggedInResetPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let { old_password, new_password } = req.body as ResetPasswordBody;
    let userId = req.user.id;
    let userInstance = await User.findByPk(userId);
    if (!userInstance) {
      reply.code(403).send({
        error: true,
        message: "No such user found!",
      });
    } else {
      if (compareSync(old_password, userInstance.password!)) {
        const hashedPassword: string = generateHashedPassword(new_password);
        userInstance.password = hashedPassword;
        await userInstance.save();
        reply.code(200).send({
          success: true,
          message: "Password Changed Successfully!",
        });
      } else {
        reply.code(403).send({
          error: true,
          message: "Please check your old password!",
        });
      }
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};
