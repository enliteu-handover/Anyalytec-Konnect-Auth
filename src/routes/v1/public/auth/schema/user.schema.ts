import { defaultTokenisedHeader } from "./../../../schema/default.schema";

const userBody: object = {
  type: "object",
  properties: {
    username: {
      type: "string",
    },
    email_id: {
      type: "string",
      format: "email",
    },
    mobile_no: {
      type: "string",
    },
    password: {
      type: "string",
      format: "password",
    },
  },
  required: ["password"],
};

export const loginSchema: any = {
  description:
    "A login REST API typically provides a secure way for users to authenticate themselves and gain access to protected resources or services.",
  tags: ["auth"],
  body: userBody,
};

export const signinSchema: any = {
  description:
    "A sign-up REST API typically provides a way for users to create new accounts on a system or service.",
  tags: ["auth"],
  body: userBody,
};

export const forgotPasswordSchema: any = {
  description:
    "A forgot password REST API typically provides user to initiate change password service",
  tags: ["auth"],
  body: {
    type: "object",
    properties: {
      email_id: {
        type: "string",
        format: "email",
      },
    },
    required: ["email_id"],
  },
};

export const verifyTokenSchema: any = {
  description: "This API validates the token before resetting the password!",
  tags: ["auth"],
  headers: {
    ...defaultTokenisedHeader,
  },
};

export const resetPasswordSchema: any = {
  description: "This API validates the resets the user password!",
  tags: ["auth"],
  body: {
    type: "object",
    properties: {
      new_password: {
        type: "string",
      },
    },
    required: ["new_password"],
  },
  headers: {
    ...defaultTokenisedHeader,
  },
};

export const preValidateUserSchema: any = {
  description: "This API validates the user avilability before sign up",
  tags: ["auth"],
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      email_id: {
        type: "string",
        format: "email",
      },
      mobile_no: {
        type: "string",
      },
    },
  },
};

export const sendOTPSchema: any = {
  description: "This API triggers an OTP to User Mobile No.",
  tags: ["auth"],
  body: {
    type: "object",
    properties: {
      mobile_no_std_code: {
        type: "string",
      },
      mobile_no: {
        type: "string",
      },
    },
    required: ["mobile_no"],
  },
};

export const verifyOTPSchema: any = {
  ...sendOTPSchema,
  description: "This API validates the OTP and authorises the user",
  body: {
    ...sendOTPSchema.body,
    properties: {
      ...sendOTPSchema.body.properties,
      otp: {
        type: "number",
      },
    },
    required: ["mobile_no", "otp"],
  },
};
