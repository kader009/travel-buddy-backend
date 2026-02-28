import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/userToken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (
  userId: string,
  expiresIn: string = '1d',
): string => {
  const payload: TokenPayload = { userId };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};

export const verifyToken = (token?: string): TokenPayload | null => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (_err) {
    return null;
  }
};
