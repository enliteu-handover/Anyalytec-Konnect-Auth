import { FastifySchema } from "fastify";
import { defaultTokenisedHeader } from "./../../../schema/default.schema";

export const bulkUserRegistrationSchema: FastifySchema = {
  description: "This API is to register multiple users!",
  tags: ["user"],
  consumes: ["multipart/form-data", "application/json"],
  ...defaultTokenisedHeader,
  body: {
    type: "object",
    properties: {
      upload_file: { isFile: true },
      bulk_users: {
        type: "array",
        items: {
          properties: {
            username: { type: "string" },
            email_id: { type: "string" },
            mobile_no: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    oneOf: [
      {
        required: ["upload_file"],
      },
      {
        required: ["bulk_users"],
      },
    ],
  },
};

export const resetPassword: any = {
  description: "This API is to reset existing password!",
  tags: ["user"],
  ...defaultTokenisedHeader,
  params: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        description: "user id",
      },
    },
  },
  body: {
    type: "object",
    properties: {
      new_password: { type: "string" },
    },
    required: ["new_password"],
  },
};

export const updateUserSchema: any = {
  description: "This API is to reset existing password!",
  tags: ["user"],
  ...defaultTokenisedHeader,
  params: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        description: "user id",
      },
    },
  },
  body: {
    type: "object",
    properties: {
      email_id: { type: "string" },
      mobile_no_std_code: { type: "string" },
      mobile_no: { type: "string" },
    },
  },
};
