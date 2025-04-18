import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { FileUpload } from 'graphql-upload-minimal';
import { ObjectId } from 'mongoose';
import { TKeyToPath } from './keyToPath.js';
import { pubSub } from '../schemas/resolvers/subs.js';
import { UPLOAD_PROGRESS } from '../schemas/resolvers/subs.js';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export class S3Service {
  static async uploadFile(file: FileUpload, userId: ObjectId, size: number) {
    const { createReadStream, filename, mimetype, encoding } = file;
    const fileStream = createReadStream();
    const key = `${Date.now()}`;
    let loadProgress = 0;
    fileStream.on('data', (chunk) => {
      loadProgress += chunk.length;
      const percent = Math.round((loadProgress / size) * 100);
      pubSub.publish(UPLOAD_PROGRESS, { load: percent, save: 0, userId });
      console.log('загрузка данных', percent);
    });

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${process.env.AWS_BUCKET_PREFIX!}/${userId}/${key}-${filename}`,
        Body: fileStream,
        ContentType: mimetype,
        ContentLength: size,
      },
    });

    upload.on('httpUploadProgress', (event) => {
      if (event.total && event.loaded) {
        const percent = Math.round((event.loaded / event.total) * 100);
        pubSub.publish(UPLOAD_PROGRESS, { load: 100, save: percent, userId });
        console.log(percent);
      }
    });

    await upload.done();
    return {
      key,
      filename,
      mimetype,
      encoding,
    };
  }

  static async deleteFile({ filename, key, userId }: TKeyToPath) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `${process.env.AWS_BUCKET_PREFIX!}/${userId}/${key}-${filename}`,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return true;
  }
}
