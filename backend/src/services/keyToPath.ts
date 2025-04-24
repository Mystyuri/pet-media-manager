import { ObjectId } from 'mongoose';

export type TKeyToPath = {
  key: string;
  filename: string;
  userId: ObjectId;
};
export const keyToPath = ({ userId, key, filename }: TKeyToPath) => {
  const AWS_URL = process.env.AWS_URL;
  const AWS_BUCKET_PREFIX = process.env.AWS_BUCKET_PREFIX;
  const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  if (!AWS_URL) {
    throw new Error('Пустой env AWS_URL');
  }
  if (key === '') {
    throw new Error('Пустой ключ');
  }
  return [
    AWS_URL,
    AWS_BUCKET_PREFIX ? AWS_BUCKET_PREFIX : AWS_BUCKET_NAME,
    userId,
    `${key}-${filename.replace(/\s/g, '+')}`,
  ].join('/');
};
