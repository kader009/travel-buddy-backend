import { Context } from '../types/context';

export const User = {
  profile: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.user.findUnique({ where: { id: parent.id } }).profile();
  },
  travelPlans: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.user.findUnique({ where: { id: parent.id } }).travelPlans();
  },
  reviewsSent: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.user.findUnique({ where: { id: parent.id } }).reviewsSent();
  },
  reviewsReceived: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.user
      .findUnique({ where: { id: parent.id } })
      .reviewsReceived();
  },
  subscription: async (
    parent: { id: string },
    args: unknown,
    { prisma }: Context,
  ) => {
    return prisma.user.findUnique({ where: { id: parent.id } }).subscription();
  },
};
