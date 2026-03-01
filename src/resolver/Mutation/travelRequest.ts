import { Context } from '../../types/context';
import { getErrorMessage } from '../../utils/errorHelper';

export const travelRequestResolver = {
  // Send a request to join a travel plan
  sendTravelRequest: async (
    parent: unknown,
    { travelPlanId, message }: { travelPlanId: string; message?: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelRequest: null };
    }

    try {
      const plan = await prisma.travelPlan.findUnique({
        where: { id: travelPlanId },
      });

      if (!plan) {
        return { userError: 'Travel plan not found', travelRequest: null };
      }

      if (plan.userId === userId) {
        return {
          userError: 'You cannot join your own plan',
          travelRequest: null,
        };
      }

      const existingRequest = await prisma.travelRequest.findFirst({
        where: { userId, travelPlanId },
      });

      if (existingRequest) {
        return {
          userError: 'You have already sent a request for this plan',
          travelRequest: null,
        };
      }

      const travelRequest = await prisma.travelRequest.create({
        data: {
          userId,
          travelPlanId,
          message,
        },
      });

      return { userError: null, travelRequest };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelRequest: null };
    }
  },

  // Update request status (Approve/Reject) - Only for the plan owner
  updateTravelRequestStatus: async (
    parent: unknown,
    {
      requestId,
      status,
    }: { requestId: string; status: 'APPROVED' | 'REJECTED' },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelRequest: null };
    }

    try {
      const request = await prisma.travelRequest.findUnique({
        where: { id: requestId },
        include: { travelPlan: true },
      });

      if (!request) {
        return { userError: 'Request not found', travelRequest: null };
      }

      if (request.travelPlan.userId !== userId) {
        return {
          userError: 'Only the plan creator can update request status',
          travelRequest: null,
        };
      }

      const updatedRequest = await prisma.travelRequest.update({
        where: { id: requestId },
        data: { status },
      });

      return { userError: null, travelRequest: updatedRequest };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelRequest: null };
    }
  },
};
