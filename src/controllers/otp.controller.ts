import { FastifyReply, FastifyRequest } from "fastify";
import { OtpToken, User, UserAttributes } from "../db/models/init-models";
import * as UserService from "./../services/users.service";
import { generateRandomNumber } from "../utils/common";
import {
  ALERTSHUB_SEND_OTP_REFERENCE_ID,
  DEFAULT_TOKEN_VALIDITY,
  OTP_LENGTH,
} from "../constants";
import { alertHub } from "../utils/alertshub";

const triggerOTP = async ({ mobile_no_std_code, mobile_no, otp }: any) => {
  return alertHub({
    reference_id: ALERTSHUB_SEND_OTP_REFERENCE_ID,
    to_mobiles: [`${mobile_no_std_code ?? ""}${mobile_no}`.trim()],
    sms_body: [otp.toString()],
  });
};

/** This controller sends otp to requested user  */
export const sendOtp = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let isExistingUser: boolean = true;
    const attributes = req.body as UserAttributes;
    let userInstance: User | null = await UserService.findUnique(attributes);
    if (!userInstance) {
      isExistingUser = false;
      userInstance = await UserService.create(attributes);
    }
    let otp: number = generateRandomNumber(OTP_LENGTH);
    if (process.env.NODE_ENV == "development") {
      otp = Number(
        Array.from({ length: OTP_LENGTH }, (_, i) => i + 1).join("")
      );
    }
    let tempDate: Date = new Date();
    tempDate = new Date(
      tempDate.setMinutes(tempDate.getMinutes() + DEFAULT_TOKEN_VALIDITY)
    );
    if (isExistingUser)
      await OtpToken.destroy({ where: { user_id: userInstance.id } }); //Removing Existing OTP tokens!
    await userInstance.createOtp_token({ otp, valid_till: tempDate });
    let alertHubResponse: any = await triggerOTP({ ...userInstance, otp });
    reply.code(200).send({ isExistingUser, ...alertHubResponse });
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

interface VerifyOTPRequest {
  mobile_no: string;
  otp: string;
}

/** This controller verifies otp from user and validates it   */
export const verifyOtp = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let attributes = req.body as VerifyOTPRequest;
    let userInstance: User | null = await User.findOne({
      include: {
        model: OtpToken,
        as: "otp_tokens",
        where: { otp: attributes.otp },
      },
      where: { mobile_no: attributes.mobile_no },
    });
    if (!userInstance) {
      reply.unauthorized("Wrong OTP!");
    } else {
      delete userInstance.password;
      await OtpToken.destroy({ where: { user_id: userInstance.id } });
      let response: any = {
        id: userInstance.id,
        mobile_no: userInstance.mobile_no,
      };
      reply.code(200).send({
        ...response,
        token: await reply.jwtSign(response),
      });
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};

/** This controller verifies otp from user and validates it   */
export const resendOtp = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    let attributes = req.body as UserAttributes;
    let userInstance: User | null = await UserService.findUnique(attributes);
    if (!userInstance) {
      reply.unauthorized("No such user exists!");
    } else {
      let otpTokens: Array<OtpToken> = await userInstance.getOtp_tokens({
        attributes: ["otp"],
      });
      if (otpTokens.length <= 0) {
        return reply.unauthorized("No OTP requested!");
      }
      let alertHubResponse: any = await triggerOTP({
        ...userInstance,
        otp: otpTokens[0].otp,
      });
      reply
        .code(200)
        .send({ ...alertHubResponse, message: "OTP resent successfully!" });
    }
  } catch (error: any) {
    console.error(error);
    reply.internalServerError(error.message);
  }
};
