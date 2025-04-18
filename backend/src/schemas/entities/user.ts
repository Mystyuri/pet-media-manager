import { Field, InputType, ObjectType } from 'type-graphql';
import { getModelForClass, post, pre, prop as Property, Ref } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { EmailAddressResolver, ObjectIDResolver } from 'graphql-scalars';
import { ObjectId } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { GraphQLError } from 'graphql/index.js';
import { Content } from './content.js';

@pre<User>('save', async function (this) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
@post<User>('save', function (error: Error, _: Document, next: (err?: Error) => void) {
  if (error instanceof MongoServerError && error.code === 11000) {
    return next(new GraphQLError('Email already in use'));
  }
})
@ObjectType()
export class User {
  @Field(() => ObjectIDResolver)
  id!: ObjectId;

  @Field(() => EmailAddressResolver)
  @Property({ type: String, unique: true })
  email!: string;

  @Property({ type: String, required: true })
  password!: string;

  @Field(() => [Content], { nullable: true })
  @Property({ ref: 'File', type: () => [Content] })
  files?: Ref<Content>[];

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

@InputType()
export class UserInput {
  @Field(() => EmailAddressResolver)
  email!: string;

  @Field(() => String)
  password!: string;
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}

export const UserModel = getModelForClass(User);
