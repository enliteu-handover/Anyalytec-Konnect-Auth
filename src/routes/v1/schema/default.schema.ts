export const defaultTokenisedHeader: any = {
  type: "object",
  properties: {
    authorization: {
      type: "string",
      pattern: "^Bearer\\s.+",
    },
  },
  required: ["authorization"],
};
