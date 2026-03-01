import { Context } from '../../types/context';
import {
  CreateTravelPlanInput,
  UpdateTravelPlanInput,
} from '../../types/travelPlan';
import { getErrorMessage } from '../../utils/errorHelper';

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
      const startDate = new Date(args.startDate);
      const endDate = new Date(args.endDate);
      const now = new Date();

      if (startDate < now) {
        return {
          userError: 'Start date cannot be in the past',
          travelPlan: null,
        };
      }

      if (endDate <= startDate) {
        return {
          userError: 'End date must be after start date',
          travelPlan: null,
        };
      }

      const travelPlan = await prisma.travelPlan.create({
        data: {
          userId,
          destination: args.destination,
          startDate,
          endDate,
          budgetRange: args.budgetRange,
          travelType: args.travelType,
          description: args.description,
        },
      });

      return { userError: null, travelPlan };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelPlan: null };
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

      const { id: _id, startDate, endDate, ...rest } = args;
      const updateData: Partial<{
        destination: string;
        startDate: Date;
        endDate: Date;
        budgetRange: string;
        travelType: string;
        description: string;
      }> = { ...rest };

      if (startDate) updateData.startDate = new Date(startDate);
      if (endDate) updateData.endDate = new Date(endDate);

      const travelPlan = await prisma.travelPlan.update({
        where: { id: args.id },
        data: updateData,
      });

      return { userError: null, travelPlan };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelPlan: null };
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
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelPlan: null };
    }
  },
};
