import { AppContext, UnusedArg, ControllerDef } from 'types';
import { isAuthed, isRole, isGuest, and } from 'permissions';
import { User, UserRole, MutationCreateUserArgs } from 'generated/graphql';

export const usersController: ControllerDef = {
  resolvers: {
    Query: {
      users: async (
        parent: UnusedArg,
        args: {},
        context: AppContext
      ): Promise<User[]> => {
        const users = await context.prisma.user.findMany();
        return users.map((user) => ({
          id: user.id.toString(),
          email: user.email,
          role: user.role as UserRole,
        }));
      },
    },
    Mutation: {
      /**
       * Creates a user.
       */
      createUser: async (
        parent: UnusedArg,
        args: MutationCreateUserArgs,
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
    Query: {
      users: and(isAuthed, isRole(UserRole.Admin)),
    },
    Mutation: {
      createUser: isGuest,
    },
  },
};
