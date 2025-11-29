import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)",
    [name, email, hashed, role || "citizen"]
  );

  res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!result.rows.length) return res.status(400).json({ message: "User not found" });

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!);

  res.json({ token, role: user.role, userId: user.id });
};
