import DataLoader from 'dataloader';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const batchUsers = async (
  ids: readonly string[],
  prisma: PrismaClient,
): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: {
      id: { in: [...ids] },
    },
  });

  // reorder results to match the order of ids
  const userMap = new Map(users.map((user) => [user.id, user]));
  return ids.map((id) => userMap.get(id) as User);
};

export const createUserLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User>((ids) => batchUsers(ids, prisma));
