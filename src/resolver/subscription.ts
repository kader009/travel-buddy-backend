import { Context } from '../types/context';

export const Subscription = {
  user: async (
    parent: { userId: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.subscription
      .findUnique({ where: { userId: parent.userId } })
      .user();
  },
};
