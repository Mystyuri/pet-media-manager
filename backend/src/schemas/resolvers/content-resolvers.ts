import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { User } from '../entities/user.js';
import { GraphQLError } from 'graphql';
import { Content, ContentModel, ContentsResponse, UploadProgressResponse } from '../entities/content.js';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { S3Service } from '../../services/s3.service.js';
import { keyToPath } from '../../services/keyToPath.js';
import { UPLOAD_PROGRESS } from './subs.js';
import { DocumentType } from '@typegoose/typegoose';

@Resolver(Content)
export class ContentResolver {
  @Query(() => ContentsResponse)
  @Authorized()
  async contents(
    @Arg('offset', () => Number, { nullable: true }) offset: number = 0,
    @Arg('limit', () => Number, { nullable: true }) limit: number = 10,
    @Ctx('user') user: User,
  ) {
    const [data, total] = await Promise.all([
      ContentModel.find({ owner: user.id }).skip(offset).limit(limit),
      ContentModel.countDocuments({ owner: user.id }),
    ]);
    const currentPage = Math.floor(offset / limit) + 1;
    return { data, params: { total, currentPage } };
  }

  @Mutation(() => String)
  @Authorized()
  async uploadContent(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Arg('size', () => Number) size: number,
    @Ctx('user') user: User,
  ) {
    const fileUrl = await S3Service.uploadFile(file, user.id, size);

    await ContentModel.create({
      owner: user.id,
      filename: fileUrl.filename,
      mimetype: fileUrl.mimetype,
      encoding: fileUrl.encoding,
      size: size,
      key: fileUrl.key,
    });

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteContents(@Arg('ids', () => [String]) ids: string[], @Ctx('user') user: User) {
    const files = await ContentModel.find({ _id: { $in: ids }, owner: user.id });

    if (files.length === 0) {
      throw new GraphQLError('No matching files found');
    }

    // Удаляем файлы из S3
    await Promise.all(
      files.map((file) =>
        S3Service.deleteFile({
          userId: user.id,
          filename: file.filename,
          key: file.key,
        }),
      ),
    );

    // Удаляем из базы данных
    await ContentModel.deleteMany({
      _id: { $in: files.map((file) => file._id) },
      owner: user.id,
    });

    return true;
  }

  @FieldResolver(() => String) // Добавляем FieldResolver
  path(@Root() content: DocumentType<Content>) {
    const contentData = content.toObject();
    return keyToPath({
      key: contentData.key,
      filename: contentData.filename,
      userId: contentData.owner,
    });
  }

  @Subscription(() => UploadProgressResponse, {
    topics: UPLOAD_PROGRESS,
    filter: ({ payload, context }) => {
      return payload.userId === context.user.id;
    },
  })
  uploadProgress(@Root() payload: UploadProgressResponse) {
    const { load, save } = payload;
    return { load, save };
  }
}
