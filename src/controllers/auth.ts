import * as jwt from 'jsonwebtoken';
import { AppContext, ControllerDef, Parent } from 'types';
import * as permissions from 'permissions';
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
        _: Parent,
        args: MutationCreateUserArgs,
        context: AppContext
      ): Promise<Session> => {
        const user = await context.prisma.user.findFirst({
          where: {
            email: args.email,
            password: args.password,
          },
        });

        if (!user) {
          throw new Error('Invalid credentials.');
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
        _: Parent,
        args: MutationCreateSessionArgs,
        context: AppContext
      ): Promise<User> => {
        const user = await context.prisma.user.create({
          data: {
            email: args.email,
            password: args.password,
          },
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
      createSession: permissions.isGuest,
      createUser: permissions.isGuest,
    },
  },
};
