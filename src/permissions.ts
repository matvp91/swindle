import { rule, not } from 'graphql-shield';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { AppContext } from 'types';

export async function getUserForReq(req: Request, prisma: PrismaClient) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return null;
  }

  let user = null;

  try {
    const data = jwt.verify(authorizationHeader, process.env.PRIVATE_KEY);
    if (!(data instanceof Object)) {
      return null;
    }

    user = await prisma.user.findFirst({
      where: {
        id: Number(data.iss),
      },
    });
  } catch {}

  return user;
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
