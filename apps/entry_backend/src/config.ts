import "dotenv/config";

export const JWT_PASSWORD =
  process.env.JWT_PASSWORD || "JWT_token_generator_123_123";

export const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
