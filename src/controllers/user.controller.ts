import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { user, userAttributes } from "../db/models/user";
import * as UserService from "../services/users.service";
import { loggedInRecord } from "./../db/models/init-models";

/**
 * This controller is create a new User and provide access to the same
 */
export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const attributes = req.body as userAttributes;
    const user: user | null = await UserService.findUnique(attributes);
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

      const user: user | null = await UserService.findUnique(attributes);
      if (!user) {
        reply
          .code(403)
          .send({ error: true, message: "Please check credentials" });
      }
      if (user?.password) {
        if (compareSync(attributes.password!, user.password)) {
          user.addLogged_in_record(
            new loggedInRecord({
              logged_at: new Date(),
              logger_details: {
                logged_in: "success",
                requested_ip_address: req.ip,
              },
            })
          );
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
          reply.forbidden("Password does not match!");
        }
      }
    } catch (error: any) {
      console.error(error);
      reply.internalServerError(error.message);
    }
  };
