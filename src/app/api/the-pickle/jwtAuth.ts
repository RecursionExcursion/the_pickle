import jwt from "jsonwebtoken";

const PICKLE_SECRET = process.env.PICKLE_SECRET;

if (!PICKLE_SECRET) {
  throw Error("JWT Secret not set");
}

export function createToken(payload: object) {
  return jwt.sign(
    {
      data: payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1hour
    },
    PICKLE_SECRET as string
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, PICKLE_SECRET as string);
  } catch {
    return null;
  }
}
