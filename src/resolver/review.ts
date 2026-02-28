import { Context } from '../types/context';

export const Review = {
  reviewer: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.review.findUnique({ where: { id: parent.id } }).reviewer();
  },
  reviewed: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.review.findUnique({ where: { id: parent.id } }).reviewed();
  },
};
