import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AuthPayload, User, UserInput, UserModel } from '../entities/user.js';
import { generateJwt } from '../../middleware/auth.js';
import { GraphQLError } from 'graphql/index.js';

@Resolver()
export class UserResolver {
  @Query(() => User)
  @Authorized()
  async me(@Ctx('user') userCtx: User) {
    const user = await UserModel.findById(userCtx.id);
    if (!user) {
      throw new GraphQLError('User not found');
    }
    const token = generateJwt({ id: userCtx.id });

    return {
      token,
      user,
    };
  }

  @Mutation(() => AuthPayload)
  async signUp(@Arg('input', () => UserInput) input: UserInput) {
    const user = new UserModel(input);
    await user.save();

    const token = generateJwt({ id: user.id });

    return {
      token,
      user,
    };
  }

  @Mutation(() => AuthPayload)
  async signIn(@Arg('input', () => UserInput) input: UserInput) {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) {
      throw new GraphQLError('Invalid email or password');
    }

    const isValid = await user.comparePassword(input.password);
    if (!isValid) {
      throw new GraphQLError('Invalid email or password');
    }

    const token = generateJwt({ id: user.id });

    return {
      token,
      user,
    };
  }
}
