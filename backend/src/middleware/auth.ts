import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateJwt = (data: { id: ObjectId }) => {
  return jwt.sign({ id: data.id }, JWT_SECRET, { expiresIn: '24h' });
};

export const decodedJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};
