import { Context } from '../../types/context';
import { getErrorMessage } from '../../utils/errorHelper';

export const adminResolver = {
  // Admin: Update user role
  updateUserRole: async (
    parent: unknown,
    { userId, role }: { userId: string; role: string },
    { prisma, userId: adminId }: Context,
  ) => {
    if (!adminId) {
      return { userError: 'Unauthorized', user: null };
    }

    try {
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (!admin || admin.role !== 'ADMIN') {
        return { userError: 'Forbidden: Admin access required', user: null };
      }

      if (role !== 'USER' && role !== 'ADMIN') {
        return { userError: 'Invalid role. Must be USER or ADMIN', user: null };
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });

      return { userError: null, user };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), user: null };
    }
  },

  // Admin: Delete any user
  adminDeleteUser: async (
    parent: unknown,
    { userId }: { userId: string },
    { prisma, userId: adminId }: Context,
  ) => {
    if (!adminId) {
      return { userError: 'Unauthorized', user: null };
    }

    try {
      const admin = await prisma.user.findUnique({ where: { id: adminId } });
      if (!admin || admin.role !== 'ADMIN') {
        return { userError: 'Forbidden: Admin access required', user: null };
      }

      if (adminId === userId) {
        return { userError: 'Cannot delete yourself', user: null };
      }

      // Delete related data first
      await prisma.profile.deleteMany({ where: { userId } });
      await prisma.travelPlan.deleteMany({ where: { userId } });
      await prisma.review.deleteMany({ where: { reviewerId: userId } });
      await prisma.review.deleteMany({ where: { reviewedId: userId } });
      await prisma.subscription.deleteMany({ where: { userId } });

      const user = await prisma.user.delete({ where: { id: userId } });

      return { userError: null, user };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), user: null };
    }
  },

  // Admin: Delete any travel plan
  adminDeleteTravelPlan: async (
    parent: unknown,
    { id }: { id: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', travelPlan: null };
    }

    try {
      const admin = await prisma.user.findUnique({ where: { id: userId } });
      if (!admin || admin.role !== 'ADMIN') {
        return {
          userError: 'Forbidden: Admin access required',
          travelPlan: null,
        };
      }

      const travelPlan = await prisma.travelPlan.delete({ where: { id } });

      return { userError: null, travelPlan };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), travelPlan: null };
    }
  },
};
