import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Token payload schema
const TokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
});

type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const validated = TokenPayloadSchema.parse(decoded);
    return validated;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    const validated = TokenPayloadSchema.parse(decoded);
    return validated;
  } catch (error) {
    return null;
  }
}

export function getTokenExpiry(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error('Invalid expiry format');
  }

  const [, value, unit] = match;
  const now = new Date();
  const numValue = parseInt(value, 10);

  switch (unit) {
    case 'm':
      return new Date(now.getTime() + numValue * 60 * 1000);
    case 'h':
      return new Date(now.getTime() + numValue * 60 * 60 * 1000);
    case 'd':
      return new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
    default:
      throw new Error('Invalid time unit');
  }
}