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
    type: "object",
    properties: {
      authorization: { type: "string" },
    },
    required: ["authorization"],
  },
};
