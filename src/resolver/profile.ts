import { Context } from '../types/context';

export const Profile = {
  user: async (
    parent: { userId: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.profile
      .findUnique({ where: { userId: parent.userId } })
      .user();
  },
};
