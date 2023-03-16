import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { user, userAttributes } from "../db/models/user";
import * as UserService from "../services/users.service";
import { otpToken } from "./../db/models/init-models";
import { DEFAULT_TOKEN_VALIDITY } from "./../constants";
import { Op } from "sequelize";

/**
 * This controller is create a new User and provide access to the same
 */
export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const attributes = req.body as userAttributes;
    let userInstance: user | null = await UserService.findUnique(attributes);
    if (userInstance) {
      return reply.unavailableForLegalReasons("User already exists!");
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(attributes.password!, salt);
    userInstance = await UserService.create({
      ...attributes,
      password: hashedPassword,
    });
    delete userInstance.dataValues.password;
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
export const logIn =
  (fastify: FastifyInstance) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const attributes = req.body as userAttributes;

      // Default constraints to make sure accessible user logs in
      attributes.is_active = true;
      attributes.is_deleted = false;

      const userInstance: user | null = await UserService.findUnique(
        attributes
      );
      if (!userInstance) {
        return reply.forbidden("Please check credentials");
      }
      if (userInstance?.password) {
        if (compareSync(attributes.password!, userInstance.password)) {
          await userInstance.createLogged_in_record({
            logged_at: new Date(),
            logger_details: {
              logged_in: "success",
              requested_ip_address: req.ip,
            },
          });
          delete userInstance.dataValues.password;
          reply.code(200).send({
            success: true,
            message: "Logged in successfully!",
            data: {
              user: userInstance,
              token: fastify.jwt.sign({
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

export const forgotPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const attributes = req.body as userAttributes;
    const userInstance: user | null = await UserService.findUnique(attributes);
    if (!userInstance) {
      reply.code(403).send({ error: true, message: "No Such User Exists!" });
    } else {
      if (!userInstance?.is_active) {
        reply.code(403).send({
          error: true,
          message: "User is in-active, Please contact admin!",
        });
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
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

export const verifyToken = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token) {
      reply.forbidden("Missing Authorisation Token!");
    }
    let otpTokenIntance = await otpToken.findOne({
      where: { token, valid_till: { [Op.gte]: new Date() } },
    });
    if (otpTokenIntance) {
      reply.code(200).send({
        success: true,
        message: "Token is Valid!",
      });
    } else {
      reply.forbidden("Token is in Valid!");
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};
