import { defaultTokenisedHeader } from "./../../../schema/default.schema";

export const refreshUserSchema: any = {
  description: "This API refreshes user token",
  tags: ["auth"],
  headers: {
    ...defaultTokenisedHeader,
  },
};
