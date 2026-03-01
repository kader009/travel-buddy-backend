import { Context } from '../../types/context';
import { Prisma } from '@prisma/client';

export const Query = {
  // Current user
  me: async (parent: unknown, args: unknown, { prisma, userId }: Context) => {
    if (!userId) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  },

  // All users with pagination
  users: async (
    parent: unknown,
    args: { page?: number; limit?: number },
    { prisma }: Context,
  ) => {
    const page = args.page || 1;
    const limit = args.limit || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return users;
  },

  // Single user by id
  user: async (parent: unknown, args: { id: string }, { prisma }: Context) => {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },

  // All travel plans with pagination
  travelPlans: async (
    parent: unknown,
    args: { page?: number; limit?: number },
    { prisma }: Context,
  ) => {
    const page = args.page || 1;
    const limit = args.limit || 10;
    const skip = (page - 1) * limit;

    return await prisma.travelPlan.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Single travel plan by id
  travelPlan: async (
    parent: unknown,
    args: { id: string },
    { prisma }: Context,
  ) => {
    return await prisma.travelPlan.findUnique({
      where: { id: args.id },
    });
  },

  // Search & match travelers
  matchTravelers: async (
    parent: unknown,
    args: {
      destination?: string;
      startDate?: string;
      endDate?: string;
      travelType?: string;
      interests?: string[];
    },
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
    if (args.endDate) {
      whereClause.endDate = { lte: new Date(args.endDate) };
    }
    if (args.travelType) {
      whereClause.travelType = args.travelType;
    }
    if (args.interests && args.interests.length > 0) {
      whereClause.user = {
        profile: {
          travelInterests: {
            hasSome: args.interests,
          },
        },
      };
    }
    return await prisma.travelPlan.findMany({
      where: whereClause,
      include: { user: { include: { profile: true } } },
      orderBy: { startDate: 'asc' },
    });
  },

  // Get requests for a specific travel plan (only owner)
  travelRequests: async (
    parent: unknown,
    { travelPlanId }: { travelPlanId: string },
    { prisma, userId }: Context,
  ) => {
    if (!userId) return [];
    const plan = await prisma.travelPlan.findUnique({
      where: { id: travelPlanId },
    });
    if (!plan || plan.userId !== userId) return [];

    return await prisma.travelRequest.findMany({
      where: { travelPlanId },
      include: { user: true },
    });
  },

  // Get my sent requests
  myTravelRequests: async (
    parent: unknown,
    args: unknown,
    { prisma, userId }: Context,
  ) => {
    if (!userId) return [];
    return await prisma.travelRequest.findMany({
      where: { userId },
      include: { travelPlan: true },
    });
  },

  // Reviews for a specific user
  reviewsForUser: async (
    parent: unknown,
    args: { userId: string; page?: number; limit?: number },
    { prisma }: Context,
  ) => {
    const page = args.page || 1;
    const limit = args.limit || 10;
    const skip = (page - 1) * limit;

    return await prisma.review.findMany({
      where: { reviewedId: args.userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Average rating for a user
  averageRating: async (
    parent: unknown,
    args: { userId: string },
    { prisma }: Context,
  ) => {
    const result = await prisma.review.aggregate({
      where: { reviewedId: args.userId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating,
    };
  },

  // Admin: dashboard stats
  adminStats: async (
    parent: unknown,
    args: unknown,
    { prisma, userId }: Context,
  ) => {
    if (!userId) return null;

    const admin = await prisma.user.findUnique({ where: { id: userId } });
    if (!admin || admin.role !== 'ADMIN') return null;

    const totalUsers = await prisma.user.count();
    const totalTravelPlans = await prisma.travelPlan.count();
    const totalReviews = await prisma.review.count();
    const totalSubscriptions = await prisma.subscription.count({
      where: { status: 'active' },
    });

    return {
      totalUsers,
      totalTravelPlans,
      totalReviews,
      totalActiveSubscriptions: totalSubscriptions,
    };
  },
};
