import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import DataLoader from 'dataloader';
import { User } from '@prisma/client';

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    Prisma.LogLevel,
    DefaultArgs
  >;
  userId: string | null;
  userLoader: DataLoader<string, User>;
}
