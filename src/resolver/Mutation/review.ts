import { Context } from '../../types/context';
import { Prisma } from '@prisma/client';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const reviewResolver = {
  createReview: async (
    parent: unknown,
    args: { reviewedId: string; rating: number; comment: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', review: null };
    }

    try {
      if (userId === args.reviewedId) {
        return { userError: 'You cannot review yourself', review: null };
      }

      const review = await prisma.review.create({
        data: {
          reviewerId: userId,
          reviewedId: args.reviewedId,
          rating: args.rating,
          comment: args.comment,
        },
      });

      return { userError: null, review };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), review: null };
    }
  },

  updateReview: async (
    parent: unknown,
    args: { id: string; rating?: number; comment?: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', review: null };
    }

    try {
      const currentReview = await prisma.review.findUnique({
        where: { id: args.id },
      });
      if (!currentReview)
        return { userError: 'Review not found', review: null };
      if (currentReview.reviewerId !== userId)
        return { userError: 'Forbidden', review: null };

      const updateData: Prisma.ReviewUpdateInput = {};
      if (args.rating) updateData.rating = args.rating;
      if (args.comment) updateData.comment = args.comment;

      const review = await prisma.review.update({
        where: { id: args.id },
        data: updateData,
      });

      return { userError: null, review };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), review: null };
    }
  },

  deleteReview: async (
    parent: unknown,
    { id }: { id: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) {
      return { userError: 'Unauthorized', review: null };
    }

    try {
      const currentReview = await prisma.review.findUnique({ where: { id } });
      if (!currentReview)
        return { userError: 'Review not found', review: null };

      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      // Allow reviewer or Admin to delete
      if (
        currentReview.reviewerId !== userId &&
        currentUser?.role !== 'ADMIN'
      ) {
        return { userError: 'Forbidden', review: null };
      }

      const review = await prisma.review.delete({
        where: { id },
      });

      return { userError: null, review };
    } catch (error: unknown) {
      return { userError: getErrorMessage(error), review: null };
    }
  },
};
