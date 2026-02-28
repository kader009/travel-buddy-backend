import { Context } from '../../types/context';
import { Prisma } from '@prisma/client';

export const Query = {
  me: async (parent: unknown, args: unknown, { prisma, userId }: Context) => {
    if (!userId) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  },

  users: async (parent: unknown, args: unknown, { prisma }: Context) => {
    const users = await prisma.user.findMany();
    return users;
  },

  user: async (parent: unknown, args: { id: string }, { prisma }: Context) => {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },

  travelPlans: async (parent: unknown, args: unknown, { prisma }: Context) => {
    return await prisma.travelPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  travelPlan: async (
    parent: unknown,
    args: { id: string },
    { prisma }: Context,
  ) => {
    return await prisma.travelPlan.findUnique({
      where: { id: args.id },
    });
  },

  matchTravelers: async (
    parent: unknown,
    args: { destination?: string; startDate?: string; travelType?: string },
    { prisma }: Context,
  ) => {
    const whereClause: Prisma.TravelPlanWhereInput = {};
    if (args.destination) {
      whereClause.destination = {
        contains: args.destination,
        mode: 'insensitive',
      };
    }
    if (args.startDate) {
      whereClause.startDate = { gte: new Date(args.startDate) };
    }
    if (args.travelType) {
      whereClause.travelType = args.travelType;
    }
    return await prisma.travelPlan.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' },
    });
  },
};
