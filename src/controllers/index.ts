import { authController } from 'controllers/auth';
import { usersController } from 'controllers/users';

const controllers = [usersController, authController];

export const createControllers = () => {
  const mapChunk = (name: string) =>
    controllers.reduce((acc, controller) => {
      // @ts-ignore
      const input = controller[name];
      const fields = ['Query', 'Mutation', 'Subscription'];

      fields.forEach((field) => {
        if (input[field]) {
          // @ts-ignore
          acc[field] = { ...acc[field], ...input[field] };
        }
      });

      return acc;
    }, {});

  return {
    resolvers: mapChunk('resolvers'),
    permissions: mapChunk('permissions'),
  };
};
