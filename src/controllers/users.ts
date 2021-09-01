import { AppContext, UnusedArg, ControllerDef } from 'types';
import { isAuthed, isRole, and } from 'permissions';
import { User, UserRole } from 'generated/graphql';

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
  },
  permissions: {
    Query: {
      users: and(isAuthed, isRole(UserRole.Admin)),
    },
  },
};
