import { Context } from '../../types/context';

interface CreateTravelPlanInput {
  destination: string;
  startDate: string;
  endDate: string;
  budgetRange: string;
  travelType: string;
  description: string;
}

interface UpdateTravelPlanInput extends Partial<CreateTravelPlanInput> {
  id: string;
}

export const travelPlanResolver = {
  createTravelPlan: async (
    parent: unknown,
    args: CreateTravelPlanInput,
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelPlan: null };
    }

    try {
      const travelPlan = await prisma.travelPlan.create({
        data: {
          userId,
          destination: args.destination,
          startDate: new Date(args.startDate),
          endDate: new Date(args.endDate),
          budgetRange: args.budgetRange,
          travelType: args.travelType,
          description: args.description,
        },
      });

      return { userError: null, travelPlan };
    } catch (error: any) {
      return { userError: error.message, travelPlan: null };
    }
  },

  updateTravelPlan: async (
    parent: unknown,
    args: UpdateTravelPlanInput,
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelPlan: null };
    }

    try {
      const plan = await prisma.travelPlan.findUnique({
        where: { id: args.id },
      });
      if (!plan) return { userError: 'Not found', travelPlan: null };
      if (plan.userId !== userId)
        return { userError: 'Forbidden', travelPlan: null };

      const updateData: any = { ...args };
      delete updateData.id;

      if (updateData.startDate)
        updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      const travelPlan = await prisma.travelPlan.update({
        where: { id: args.id },
        data: updateData,
      });

      return { userError: null, travelPlan };
    } catch (error: any) {
      return { userError: error.message, travelPlan: null };
    }
  },

  deleteTravelPlan: async (
    parent: unknown,
    { id }: { id: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelPlan: null };
    }

    try {
      const plan = await prisma.travelPlan.findUnique({ where: { id } });
      if (!plan) return { userError: 'Not found', travelPlan: null };
      if (plan.userId !== userId)
        return { userError: 'Forbidden', travelPlan: null };

      const travelPlan = await prisma.travelPlan.delete({
        where: { id },
      });

      return { userError: null, travelPlan };
    } catch (error: any) {
      return { userError: error.message, travelPlan: null };
    }
  },
};
