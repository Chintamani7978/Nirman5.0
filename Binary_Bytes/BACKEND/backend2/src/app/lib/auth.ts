import * as jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = "auth-token";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: "7d" });
};


export const setAuthToken = (res: NextResponse, token: string) => {
  res.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};


export const getAuthToken = (req: NextRequest) => {
  return req.cookies.get(TOKEN_NAME)?.value;
};

export const removeAuthToken = (res: NextResponse) => {
  res.cookies.set({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as { userId: string };
  } catch {
    return null;
  }
};
