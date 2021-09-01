import { AppContext, Parent, ControllerDef } from 'types';
import * as permissions from 'permissions';
import { User, UserRole } from 'generated/graphql';
import { and } from 'graphql-shield';

export const usersController: ControllerDef = {
  resolvers: {
    Query: {
      users: async (
        _: Parent,
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
  },
  permissions: {
    Query: {
      users: and(permissions.isAuthed, permissions.isRole(UserRole.Admin)),
    },
  },
};
