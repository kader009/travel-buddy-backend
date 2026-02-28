import { Context } from '../types/context';

export const TravelPlan = {
  user: async (parent: { id: string }, args: unknown, { prisma }: Context) => {
    return prisma.travelPlan.findUnique({ where: { id: parent.id } }).user();
  },
};
