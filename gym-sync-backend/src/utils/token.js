import crypto from "crypto";

export const generateVerificationToken = () => {
  const code = crypto.randomBytes(32).toString("hex");
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  return { code, hashedCode };
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateNumericCode = () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  return { code, hashedCode };
};
