const userBody: object = {
  type: "object",
  properties: {
    user: {
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
    },
  },
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
