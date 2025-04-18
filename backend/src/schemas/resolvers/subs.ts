import { createPubSub } from '@graphql-yoga/subscription';
import { ObjectId } from 'mongoose';

export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';

export const pubSub = createPubSub<{
  UPLOAD_PROGRESS: [{ load: number; save: number; userId: ObjectId }];
}>();
