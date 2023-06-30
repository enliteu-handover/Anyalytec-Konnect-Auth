import { defaultTokenisedHeader } from "./../../../schema/default.schema";

export const refreshUserSchema: any = {
  description: "This API refreshes user token",
  tags: ["auth"],
  ...defaultTokenisedHeader,
};

export const resetPasswordSchema: any = {
  description: "This API resets user password",
  tags: ["auth"],
  ...defaultTokenisedHeader,
  body: {
    type: "object",
    properties: {
      old_password: {
        type: "string",
      },
      new_password: {
        type: "string",
      },
    },
    required: ["old_password", "new_password"],
  },
};
