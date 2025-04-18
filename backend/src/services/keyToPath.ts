import { ObjectId } from 'mongoose';

export type TKeyToPath = {
  key: string;
  filename: string;
  userId: ObjectId;
};
export const keyToPath = ({ userId, key, filename }: TKeyToPath) =>
  `${process.env.AWS_URL}/${process.env.AWS_BUCKET_PREFIX}/${userId}/${key}-${filename.replace(/\s/g, '+')}`;
