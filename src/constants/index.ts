export const PRIVATE_FOLDER = "private";
export const PUBLIC_FOLDER = "public";

export const DEFAULT_TOKEN_VALIDITY = Boolean(
  process.env.DEFAULT_TOKEN_VALIDITY
)
  ? Number(process.env.DEFAULT_TOKEN_VALIDITY)
  : 30;

export const OTP_LENGTH = 6;
export const ALERTSHUB_SEND_OTP_REFERENCE_ID: string = "signUpOtp";

export const WHATSAPP_MESSAGE_ENDPOINT: string = "/messages";
export const WHATSAPP_MESSAGE_FOR_AUTH: string = "Send message to initiate!";

export const LOG_STATUS = {
  SUCCESS: "success",
  WHATSAPP_REQUESTED: "Whatsapp requested",
  WHATSAPP_SUCCESSFULL: "Whatsapp Login Successfull",
};

export const FILE_UPLOAD_FOLDER = "./src/uploads";

export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "PASS@123";
