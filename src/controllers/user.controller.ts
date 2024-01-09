import { FastifyRequest, FastifyReply, RouteHandlerMethod } from "fastify";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import csvParser from "csv-parser";
import XLSX from "xlsx";
import * as UserService from "../services/users.service";
import {
  OtpToken,
  User,
  UserAttributes,
  UserCreationAttributes,
} from "./../db/models/init-models";
import {
  DEFAULT_PASSWORD,
  DEFAULT_TOKEN_VALIDITY,
  FILE_UPLOAD_FOLDER,
  LOG_STATUS,
} from "./../constants";
import { TOKEN_CONSTANTS, validateToken } from "./../services/otptoken.service";
import { ResetPasswordBody } from "./../types/request_body";
import { createReadStream, promises } from "fs";
import { resolve as pathResolve } from "path";

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

const ALLOWED_UPLOAD_FORMATS: Array<string> = ["csv", "xls", "xlsx"];

const preProcessFile = (filePath: string): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    try {
      let users: Array<any> = [];
      if (filePath.toLowerCase().includes("csv")) {
        createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (chunk: Array<any>) => users.push(chunk))
          .on("close", () => {
            resolve(users);
          })
          .on("error", reject);
      } else {
        const workBook = XLSX.readFile(filePath);
        users = XLSX.utils.sheet_to_json(
          workBook.Sheets[workBook.SheetNames[0]]
        );
        resolve(users);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const extractData = (data: Array<any>): Array<UserCreationAttributes> => {
  return data.map((i) => {
    return {
      username: i?.username,
      email_id: i?.email_id,
      mobile_no: i?.mobile_no.toString(),
      mobile_no_std_code: i?.mobile_no_std_code.toString(),
      password: generateHashedPassword(i?.password ?? DEFAULT_PASSWORD),
    };
  });
};

export const bulkUserRegistration: RouteHandlerMethod = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { upload_file, bulk_users } = req.body as any;
    if (!upload_file && !bulk_users) {
      reply.badRequest(`Please upload a file or provide bulk_users!`);
    }
    let users: Array<any> = [];
    if (upload_file) {
      let { filename } = upload_file;
      if (
        !ALLOWED_UPLOAD_FORMATS.includes(filename.split(".")[1].toLowerCase())
      ) {
        return reply.badRequest("Please upload CSV or Excel file!");
      }
      let filePath = pathResolve(FILE_UPLOAD_FOLDER, filename);
      await promises.writeFile(filePath, upload_file.file);
      users = await preProcessFile(filePath);
      users = await extractData(users);
    }
    if (bulk_users && bulk_users.length) {
      users = bulk_users;
    }
    let responseUserData: Array<Partial<UserAttributes>> = [];
    if (users.length) {
      await Promise.all(
        users.map(async (ele: UserCreationAttributes) => {
          let { username, email_id, mobile_no, password } = ele;
          let userInstance: User | null = await UserService.findUnique({
            username,
            email_id,
            mobile_no,
          } as UserAttributes);
          if (userInstance) {
            userInstance.password = password;
            await userInstance.save();
          } else {
            userInstance = await UserService.create({
              ...ele,
            });
          }
          responseUserData.push({
            id: userInstance.getDataValue("id"),
            username,
            email_id,
            mobile_no,
          });
        })
      );
      reply.code(200).send({
        status: "success",
        userData: responseUserData,
      });
    } else {
      reply.badRequest("No users provided for bulk upload!");
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

interface Params {
  user_id: number;
}

export const resetUserPassword: RouteHandlerMethod = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  let { user_id } = req.params as Params;
  let { new_password } = req.body as ResetPasswordBody;
  try {
    let userInstance: User | null = await User.findByPk(user_id);
    if (!userInstance) {
      reply.forbidden("User doesn't exists!");
    } else {
      userInstance.password = generateHashedPassword(new_password);
      await userInstance.save();
      reply
        .code(200)
        .send({ success: true, message: "Successfully updated password!" });
    }
  } catch (error: any) {
    console.log(error);
    reply.internalServerError(error.message);
  }
};

export const updateUserDetails: RouteHandlerMethod = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  let { user_id } = req.params as Params;
  let { email_id, mobile_no, mobile_no_std_code } =
    req.body as Partial<UserAttributes>;
  try {
    let userInstance: User | null = await User.findByPk(user_id);
    if (!userInstance) {
      reply.forbidden("User doesn't exists!");
    } else {
      if (email_id) userInstance.email_id = email_id;
      if (mobile_no_std_code)
        userInstance.mobile_no_std_code = mobile_no_std_code;
      if (mobile_no) userInstance.mobile_no = mobile_no;
      await userInstance.save();
      reply
        .code(200)
        .send({ success: true, message: "Successfully updated user!" });
    }
  } catch (error: any) {
    console.log(error);
    reply.internalServerError(error.message);
  }
};
