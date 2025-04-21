import { ObjectId } from 'mongoose';

export type TKeyToPath = {
  key: string;
  filename: string;
  userId: ObjectId;
};
export const keyToPath = ({ userId, key, filename }: TKeyToPath) => {
  const AWS_URL = process.env.AWS_URL;
  const AWS_BUCKET_PREFIX = process.env.AWS_BUCKET_PREFIX;
  if (!AWS_URL || !AWS_BUCKET_PREFIX) {
    throw new Error('Пустой env AWS_URL или AWS_BUCKET_PREFIX');
  }
  if (key === '') {
    throw new Error('Пустой ключ');
  }
  return `${process.env.AWS_URL}/${process.env.AWS_BUCKET_PREFIX}/${userId}/${key}-${filename.replace(/\s/g, '+')}`;
};
