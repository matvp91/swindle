import { AppContext, ControllerDef, UnusedArg } from 'types';
import { isGuest } from 'permissions';
import { createToken } from 'token';
import { Session, MutationCreateSessionArgs } from 'generated/graphql';

export const authController: ControllerDef = {
  resolvers: {
    Mutation: {
      /**
       * Creates a token for a given email and password,
       * may then be provided by the Authorization header.
       */
      createSession: async (
        parent: UnusedArg,
        args: MutationCreateSessionArgs,
        context: AppContext
      ): Promise<Session> => {
        const user = await context.prisma.user.findFirst({
          where: args,
        });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        return {
          token: createToken(user.id.toString()),
        };
      },
    },
  },
  permissions: {
    Mutation: {
      createSession: isGuest,
    },
  },
};
