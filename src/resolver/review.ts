import { Context } from '../types/context';

export const Review = {
  reviewer: async (
    parent: { reviewerId: string },
    args: unknown,
    { userLoader }: Context,
  ) => {
    return userLoader.load(parent.reviewerId);
  },
  reviewed: async (
    parent: { reviewedId: string },
    args: unknown,
    { userLoader }: Context,
  ) => {
    return userLoader.load(parent.reviewedId);
  },
};
