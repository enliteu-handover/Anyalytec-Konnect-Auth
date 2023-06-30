import { defaultTokenisedHeader } from "./../../../schema/default.schema";

export const bulkUserRegistrationSchema: any = {
  description: "This API is to register multiple users!",
  tags: ["user"],
  consumes: ["multipart/form-data"],
  ...defaultTokenisedHeader,
  body: {
    type: "object",
    properties: {
      upload_file: { isFile: true },
    },
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
