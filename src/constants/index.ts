export const PRIVATE_FOLDER = "private";
export const PUBLIC_FOLDER = "public";

export const DEFAULT_TOKEN_VALIDITY = Boolean(
  process.env.DEFAULT_TOKEN_VALIDITY
)
  ? Number(process.env.DEFAULT_TOKEN_VALIDITY)
  : 30;
