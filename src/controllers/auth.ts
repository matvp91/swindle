import * as jwt from 'jsonwebtoken';
import { AppContext, ControllerDef, UnusedArg } from 'types';
import { isGuest } from 'permissions';
import {
  Session,
  User,
  UserRole,
  MutationCreateUserArgs,
  MutationCreateSessionArgs,
} from 'generated/graphql';

export const authController: ControllerDef = {
  resolvers: {
    Mutation: {
      createSession: async (
        parent: UnusedArg,
        args: MutationCreateUserArgs,
        context: AppContext
      ): Promise<Session> => {
        const user = await context.prisma.user.findFirst({
          where: args,
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          {
            iss: user.id,
          },
          process.env.PRIVATE_KEY
        );

        return {
          token,
        };
      },
      createUser: async (
        parent: UnusedArg,
        args: MutationCreateSessionArgs,
        context: AppContext
      ): Promise<User> => {
        const user = await context.prisma.user.create({
          data: args,
        });
        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role as UserRole,
        };
      },
    },
  },
  permissions: {
    Mutation: {
      createSession: isGuest,
      createUser: isGuest,
    },
  },
};
