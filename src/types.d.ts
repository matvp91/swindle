import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY: string;
    }
  }
}

export interface AppContext {
  prisma: PrismaClient;
  user?: any;
}

export interface ControllerDef {
  resolvers: any;
  permissions: any;
}

export type UnusedArg = any;
