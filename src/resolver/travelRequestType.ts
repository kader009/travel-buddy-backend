import { Context } from '../types/context';

export const TravelRequest = {
  user: async (
    parent: { userId: string },
    args: unknown,
    { userLoader }: Context,
  ) => {
    return userLoader.load(parent.userId);
  },
  travelPlan: async (
    parent: { travelPlanId: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.travelPlan.findUnique({
      where: { id: parent.travelPlanId },
    });
  },
};
