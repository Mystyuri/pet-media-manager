import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.js';
import { ObjectId } from 'mongoose';
import { ObjectIDResolver } from 'graphql-scalars';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@ObjectType()
export class Content {
  @Field(() => ObjectIDResolver)
  readonly id!: ObjectId;

  @Field(() => String)
  @prop({ type: String, required: true })
  filename!: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  mimetype!: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  encoding!: string;

  @prop({ type: String, required: true })
  key!: string;

  @Field(() => Number)
  @prop({ type: Number, required: true })
  size!: number;

  @Field(() => ObjectIDResolver)
  @prop({ ref: 'User', required: true })
  owner!: ObjectId;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

@ObjectType()
class ContentsResponseParams {
  @Field(() => Number)
  total!: number;

  @Field(() => Number)
  currentPage!: number;
}

@ObjectType()
export class ContentsResponse {
  @Field(() => [Content])
  data!: Content[];

  @Field(() => ContentsResponseParams)
  params!: ContentsResponseParams;
}

@ObjectType()
export class UploadProgressResponse {
  @Field(() => Number)
  load!: number;
  @Field(() => Number)
  save!: number;
  userId!: ObjectId;
}

export const ContentModel = getModelForClass(Content);
