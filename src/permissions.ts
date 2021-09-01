import { rule, not } from 'graphql-shield';
import { unpackToken } from 'token';
import { Request } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { AppContext } from 'types';

export { and } from 'graphql-shield';

export async function getUserForReq(req: Request, prisma: PrismaClient) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  try {
    const data = unpackToken(authHeader);
    return await prisma.user.findFirst({
      where: {
        id: Number(data.iss),
      },
    });
  } catch {
    return null;
  }
}

export const isAuthed = rule()((parent: any, args: {}, context: AppContext) => {
  if (!context.user) {
    return 'Authentication required';
  }
  return true;
});

export function isRole(role: UserRole) {
  return rule('isRole')((parent: any, args: {}, context: AppContext) => {
    const { user } = context;
    if (!user) {
      return false;
    }
    if (user.role !== role) {
      return 'User does not have the proper permissions';
    }
    return true;
  });
}

export const isGuest = not(isAuthed, 'Already authenticated');
