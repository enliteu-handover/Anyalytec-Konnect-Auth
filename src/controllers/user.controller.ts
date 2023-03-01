import { FastifyRequest, FastifyReply } from "fastify";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { UserInstance } from "../db/models/user";
import { UserAttributes } from "../types";
import * as UserService from "../services/users.service";
import * as LoggedInRecordService from "../services/logged_in_records.service";

type UserCreateBody = { user: UserAttributes };

/**
 * This controller is create a new User and provide access to the same
 */
export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const attributes = (req.body as UserCreateBody).user;
    const user: UserInstance = await UserService.findUnique(attributes);
    if (user) {
      throw new Error("User already exists!");
    }
    if (!attributes.password) {
      throw new Error("Password is required!");
    }
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(attributes.password, salt);
    const userInstance = await UserService.create({
      ...attributes,
      password: hashedPassword,
    });
    delete userInstance.dataValues.password;
    reply.code(200).send({
      success: true,
      message: "Successfully created user",
      data: { user: userInstance },
    });
  } catch (error: any) {
    console.error(error);
    reply.code(500).send({ error: true, message: error.message });
  }
};

/**
 * This login controller validates user credentials and provides access for the same
 */
export const logIn =
  (fastify: any) => async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const attributes = (req.body as UserCreateBody).user;

      // Default constraints to make sure accessible user logs in
      attributes.is_active = true;
      attributes.is_deleted = false;

      const user: UserInstance = await UserService.findUnique(attributes);
      if (!user) {
        reply
          .code(403)
          .send({ error: true, message: "Please check credentials" });
      }
      if (user.password) {
        if (compareSync(attributes.password!, user.password)) {
          LoggedInRecordService.create({
            user_id: user.id,
            logged_at: new Date(),
            logger_details: {
              logged_in: "success",
              requested_ip_address: req.ip,
            },
          });
          delete user.dataValues.password;
          reply.code(200).send({
            success: true,
            message: "Logged in successfully!",
            data: {
              user: user,
              token: fastify.jwt.sign({
                id: user.id,
                username: user.username,
                email_id: user.email_id,
              }),
            },
          });
        } else {
          reply
            .code(403)
            .send({ error: true, message: "Password does not match!" });
        }
      }
    } catch (error: any) {
      console.error(error);
      reply.code(500).send({ error: true, message: error.message });
    }
  };
