import { Op } from "sequelize";
import { OtpToken, OtpTokenCreationAttributes } from "./../db/models/otp_token";

export const TOKEN_CONTANTS = {
  VALID: "Token is Valid!",
  INVALID: "Token is in Valid!",
};

export const validateToken = (params: OtpTokenCreationAttributes) => {
  return new Promise((resolve, reject) => {
    OtpToken.findOne({
      where: {
        token: params.token,
        valid_till: {
          [Op.lte]: new Date(),
        },
      },
    })
      .then((result: OtpToken | null) => {
        if (result) resolve({ success: true, message: TOKEN_CONTANTS.VALID });
        else reject(new Error(TOKEN_CONTANTS.INVALID));
      })
      .catch(reject);
  });
};
